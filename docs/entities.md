# QueueLess — Database Entities

## 1. User

**What it represents:** Anyone who logs into QueueLess — customer, staff, or admin.

**Reason to exist:** A single User table allows all users to authenticate through the same system while the `role` field determines their permissions.

---

## 2. Organization

**What it represents:** The business or institution running queues, such as a clinic, bank branch, or government office.

**Reason to exist:** It is the top-level entity that owns and organizes the services offered to customers.

---

## 3. Service

**What it represents:** A specific service offered by an organization, such as "Passport Renewal" or "Doctor Consultation."

**Reason to exist:** It defines what customers are joining a queue for and belongs to one Organization.

---

## 4. Queue

**What it represents:** One day's operating queue for a particular Service.

**Reason to exist:** It represents the active queue for a service and allows token numbers and queue status to reset daily while preserving historical records.

---

## 5. QueueEntry

**What it represents:** One customer's ticket/token inside a Queue.

**Reason to exist:** It records a customer's position and current status in the queue.

---

## 6. Notification

**What it represents:** A message sent to a User about their queue status.

**Reason to exist:** It allows QueueLess to inform customers about events such as being called, approaching their turn, or having their ticket status changed.


## User Role Design

QueueLess uses a single User entity for all types of users.

The User table has a `role` enum with three possible values:

- `CUSTOMER` — a customer who joins queues.
- `STAFF` — staff members who manage queues.
- `ADMIN` — administrators who manage organizations and system-level operations.

There is no separate Staff table.

If staff-specific information is required in the future, a separate `StaffProfile` entity can be introduced with a foreign key referencing the User.


## Queue Entry Status Decisions

### SKIPPED

`SKIPPED` is a terminal state. Once a queue entry is skipped, it is considered gone from the current queue. If the customer wants service again, they must join the queue again.

### NO_SHOW

`NO_SHOW` can only be reached from `CALLED`. A customer is marked as `NO_SHOW` only after their token has been called and they do not appear.


## Foreign Key Relationships

Organization (1) ──< Service (many)

Service (1) ──< Queue (many)

Queue (1) ──< QueueEntry (many)

User (1) ──< QueueEntry (many)

User (1) ──< Notification (many)

## Foreign Keys and Delete Behavior

| Foreign Key | Parent | On Parent Delete |
|---|---|---|
| Service.organizationId | Organization | CASCADE |
| Queue.serviceId | Service | CASCADE |
| QueueEntry.queueId | Queue | RESTRICT |
| QueueEntry.userId | User | RESTRICT |
| Notification.userId | User | CASCADE |

### Design Notes

QueueEntry records are historical business records and should not be removed when a queue or user is removed.

QueueEntry deletion should therefore be restricted. Queue entries will normally be preserved and their status changed instead of being hard-deleted.