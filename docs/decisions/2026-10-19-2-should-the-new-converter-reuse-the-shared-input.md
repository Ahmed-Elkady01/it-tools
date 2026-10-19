# Should the new converter reuse the shared input and output page component? AutoPilot chose: Use the same input and copyable output layout as the existing converter. (#2)

**Question:** Should the new converter reuse the shared input and output page component?

**What:** Should the new converter reuse the shared input and output page component? AutoPilot chose: Use the same input and copyable output layout as the existing converter.

**Why:** AutoPilot settled this without asking a person, because reverting this PR undoes it.

**Evidence:**

- src/tools/json-to-csv/json-to-csv.vue:24
- src/components/FormatTransformer.vue:8
- src/components/TextareaCopyable.vue:52

**Undo:** Revert the PR that added this record (#2), or reply on the ticket with what you want instead and AutoPilot will re-plan.
