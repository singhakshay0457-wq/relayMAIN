# Security Specification for Relay AI Firestore

## 1. Data Invariants
- **Lead Collection (`/leads/{leadId}`)**:
  - `name`, `email`, `company`, `volume`, `score`, `playbook`, `status`, and `createdAt` are mandatory.
  - `score` must be a number between 0 and 100 inclusive.
  - `createdAt` must be equal to the server's current timestamp (`request.time`) on creation.
  - Leads are publicly writeable (for any submitter), but only viewable/listable by authenticated admins (or the authorized logged-in user).
- **Trial Collection (`/trials/{trialId}`)**:
  - `name`, `email`, `company`, `crm`, `volume`, `voice`, `welcomeMsg`, and `createdAt` are mandatory.
  - `createdAt` must be equal to the server's current timestamp (`request.time`) on creation.
  - Trials are publicly writeable, but viewable only by authenticated admins.

## 2. The "Dirty Dozen" Payloads (Designed to violate security rules)

### Lead Exploits
1. **Malicious ID injection**: Attempting to create a lead with a 1MB string or invalid character set as `leadId`.
2. **Score Over-Privilege**: Creating a lead with `score` set to 999 to gain artificial priority.
3. **Negative Score Injection**: Creating a lead with `score` set to -50.
4. **Impersonate timestamp**: Creating a lead with `createdAt` set to a hardcoded client date instead of `request.time`.
5. **Junk Field injection**: Adding `isAdmin: true` or `role: "admin"` inside the lead document.
6. **Missing Required Fields**: Creating a lead without the `email` field.

### Trial Exploits
7. **Malicious ID injection**: Attempting to create a trial with invalid characters as `trialId`.
8. **Junk Field injection**: Injecting `ghostField: "hack"` into a trial creation.
9. **Impersonate timestamp**: Bypassing server timestamp by injecting a custom static `createdAt` date.
10. **Unauthorized Read**: An unauthenticated user attempting to list all entries in `/leads`.
11. **Unauthorized Update**: Attempting to update an existing lead's fields without admin authorization.
12. **Unauthorized Delete**: Attempting to delete a trial record without admin authorization.

## 3. Test Runner Configuration (firestore.rules.test.ts)
The verification tests are designed to mock Firestore operations and ensure that all dirty payloads return `PERMISSION_DENIED` under strict rules.

```typescript
import { assertFails, initializeTestEnvironment } from '@firebase/rules-unit-testing';

// Verification test suite checking that each of the Dirty Dozen returns a failure
describe("Relay AI Firestore Fortress Rules Validation", () => {
  let testEnv: any;

  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "phonic-tempo-w224x",
      firestore: {
        rules: require('fs').readFileSync('firestore.rules', 'utf8')
      }
    });
  });

  after(async () => {
    await testEnv.cleanup();
  });

  it("should fail malicious ID injection on leads", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const docRef = db.collection("leads").doc("invalid-id-$$$");
    await assertFails(docRef.set({ name: "Hacker", email: "hacker@evil.com", company: "Evil Corp", volume: "5000+", score: 90, playbook: "None", status: "Triggered", createdAt: new Date() }));
  });

  it("should fail score over-privilege on leads", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const docRef = db.collection("leads").doc("lead123");
    await assertFails(docRef.set({ name: "Hacker", email: "hacker@evil.com", company: "Evil Corp", volume: "5000+", score: 999, playbook: "None", status: "Triggered", createdAt: new Date() }));
  });
});
```
