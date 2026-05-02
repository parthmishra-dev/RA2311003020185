# Notification System Design

## Stage 1
Designed REST APIs for notifications with clear endpoints and JSON structure. Implemented real-time updates using polling.

## Stage 2
Used PostgreSQL with schema including id, userId, type, message, isRead, createdAt. Added indexes on userId and createdAt.

## Stage 3
Query was slow due to missing composite index. Added index on (studentId, isRead, createdAt DESC).

## Stage 4
Implemented pagination and caching using Redis to reduce DB load and improve performance.

## Stage 5
Used queue-based architecture with retry mechanism to handle failures and ensure reliability.

## Stage 6
Implemented priority inbox using type weight and recency. Placement > Result > Event. Sorted and returned top 10 notifications.