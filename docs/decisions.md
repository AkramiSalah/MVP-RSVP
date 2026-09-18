# Open for Decision:

## Organizer Ergonomics: how does the organizer see the status?:
- Option A: Minimal web page (SPA with a read only status table)
- Option B: WhatsApp summary message on request

## WhatsApp integration: how do we integrate the WhatsApp API?
- [x] Official WhatsApp API — direct Meta Cloud API
- [ ] Official BSP for the WhatsApp Business API
- [ ] Unofficial wrappers (e.g. automated WhatsApp Web libraries)

**Decided: Official WhatsApp Business API — direct Meta Cloud API.**
Started by evaluating [Twilio](https://www.twilio.com/) (an official 
BSP for the WhatsApp Business API). Hit template/button restrictions 
during Twilio's free trial that required upgrading before testing 
anything of real significance, which felt like an unnecessary blocker 
this early. Switched to Meta's direct Cloud API, which provides free 
developer test numbers for building and validating interactive (button) 
messages without needing to submit for approval or pay upfront.

Option C was never really on the table, since it isn't ToS compliant 
and exposes me to risks like account bans and potential legal issues.

## Tech Stack: what do we build the backend in?
**Decided: Python, FastAPI, SQLite.**
Considered C/C++ (strongest personal skillset) but ruled it out — no 
mature web framework ecosystem, and this app's workload (webhook 
receive, DB write, outbound HTTP call) is I/O-bound, not compute-bound, 
so C/C++'s performance advantage doesn't apply here. Chose FastAPI for 
fastest path to a working skeleton with minimal boilerplate; SQLite for 
zero-setup MVP storage, swappable for Postgres later if needed.


## System Architecture: monolith vs. microservices
**Decided: Monolith, no microservices.**
Considered splitting out C/C++ microservices for performance-critical 
paths. Ruled out for v1 — microservices solve scaling/organizational 
problems (independent deployability, team boundaries) that don't exist 
yet for a solo-built MVP, and would add infrastructure overhead with no 
corresponding benefit at this stage. Revisit only if profiling reveals 
an actual compute-bound bottleneck at real scale.

