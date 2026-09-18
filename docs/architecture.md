# Data Model

## Events
| Field | Type | Notes |
|---|---|---|
| id | integer, PK | |
| name | string | |
| created_at | datetime | |

## Invitees
| Field | Type | Notes |
|---|---|---|
| id | integer, PK | |
| event_id | integer, FK → Events.id | |
| name | string | |
| phone_number | string | |
| status | enum | pending / sent / confirmed / declined / unsure |
| created_at | datetime | |
| updated_at | datetime | |

Each Invitee belongs to exactly one Event. Multi-event support was 
included from v1 even though the MVP only needs a single event at a 
time, since the underlying business model (per-event pricing, repeat 
organizers) implies this relationship will matter quickly.

NOTE: No Organizers/auth table for MVP — single-operator assumption for v1.

```mermaid
    erDiagram
        EVENTS ||--o{ INVITEES : has
        EVENTS {
            int id
            string name
            datetime created_at
        }
        INVITEES {
            int id
            int event_id
            string name
            string phone_number
            string status
            datetime created_at
            datetime updated_at
        }
```


# System Flow


```mermaid
    sequenceDiagram
    title The Core of the RSVP loop
    participant O as Organizer
    participant A as App
    participant DB as Database
    participant M as Meta WhatsApp API
    participant I as Invitee

    O->>A: Upload spreadsheet (name, phone)
    A->>DB: Create Event + Invitee records (status: pending)
    A->>M: Send RSVP template (Yes/No/Unsure)
    M->>I: Deliver WhatsApp message
    A->>DB: Update status: sent

    I->>M: Press button (Yes/No/Unsure)
    M->>A: Webhook: button reply
    A->>DB: Update status: confirmed/declined/unsure

    O->>A: Request status update
    A->>DB: Read all invitee statuses
    A->>M: Send summary message
    M->>O: Deliver status summary
```
















