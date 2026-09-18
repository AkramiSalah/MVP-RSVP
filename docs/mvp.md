# Core Issue
* **People organize events, they need to know who is planning to participate and who isnt.**
* **maintaining answers form potential prticipants sucks. takes time. and takes the soul outta you, and it feels uncomfortable at times.**

# Proposed Minimal Functionality
* upload a spreadsheet with participants info, mainly phone number and name 
* send WhatsApp RSVP requests to each 
* capture and store response or lack thereof
* show response on the user's end.


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


