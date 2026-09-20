package com.queueless.backend.entity;

public enum QueueEntryStatus {
    WAITING,
    CALLED,
    SERVING,
    COMPLETED,
    CANCELLED,
    NO_SHOW
}
