# Data transfer objects (DTO)
DTOs define a mapping of data, from entities or other objects, that are sent externally.

They are useful because:
- They make it so that you don't expose your database structure by sending entities in your responses. Though, by itself, this is not particularily unsafe.</item>
- They make development easier by your response data structure is not fixed to the database's.</item>