# How should parsing failures reach the output area? AutoPilot chose: Invalid CSV becomes an explicit result that the page displays safely. (#2)

**Question:** How should parsing failures reach the output area?

**What:** How should parsing failures reach the output area? AutoPilot chose: Invalid CSV becomes an explicit result that the page displays safely.

**Why:** AutoPilot settled this without asking a person, because reverting this PR undoes it.

**Evidence:**

- src/components/FormatTransformer.vue:33
- src/tools/json-to-csv/json-to-csv.vue:8
- src/tools/token-generator/token-generator.tool.vue:12

**Undo:** Revert the PR that added this record (#2), or reply on the ticket with what you want instead and AutoPilot will re-plan.
