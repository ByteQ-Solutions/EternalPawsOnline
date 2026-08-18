# Dispatch: Sub-Orchestrator Milestone M5 (Engagement, Submissions & Admin CMS)

## Mission
You are the Sub-Orchestrator for Milestone M5 (Newsletter, 5-Step Story Submissions with Auto-Save, Admin Editorial CMS Dashboard, 9-Point Pre-Publish Checklist, and Automated 301 Redirect Engine).
Working directory: `e:/Claude/EternalPaws/Eternal-Paws/.agents/sub_orch_m5_cms`
Parent conversation ID: `f7c2db5d-b91f-4eb6-a940-e6f2ea98b040`

## Your Task
1. Read `e:/Claude/EternalPaws/Eternal-Paws/ORIGINAL_REQUEST.md`, `e:/Claude/EternalPaws/Eternal-Paws/PROJECT.md`, and `e:/Claude/EternalPaws/Eternal-Paws/.agents/sub_orch_m5_cms/SCOPE.md`.
2. Follow standard Project Sub-Orchestrator procedure:
   - Run the iteration cycle: Explorer -> Worker -> 2 Reviewers -> 2 Challengers -> Forensic Auditor.
   - For Worker prompt, include mandatory warning:
     "DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected."
   - Enforce gate criteria: Build & Tests pass + 2 APPROVE reviews + Challenger approval + CLEAN Forensic Audit.
3. Upon gate passing, update `progress.md` and report completion to parent via `send_message`.
