import mariadb

# --- DB Configuration ---
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",  # No password
    "database": "pidata"
}

# --- SQL Statements ---
SQL_COMMANDS = [
    "SET GLOBAL event_scheduler = ON;",
    # Keep only 2 weeks of 5 min median data
    """
    CREATE EVENT IF NOT EXISTS prune_old_sensor_data
    ON SCHEDULE EVERY 1 HOUR
    DO
      DELETE FROM sensor_5min_median
      WHERE end_ts < UNIX_TIMESTAMP(NOW()) - 14 * 86400;
    """,
    # Keep only 1 week of error data
    """
    CREATE EVENT IF NOT EXISTS prune_old_error_data
    ON SCHEDULE EVERY 1 HOUR
    DO
      DELETE FROM sensor_errors
      WHERE end_ts < UNIX_TIMESTAMP(NOW()) - 7 * 86400;
    """,
    # Keep only 100 entries of error data
    """
    CREATE EVENT IF NOT EXISTS prune_old_error_data_limit
    ON SCHEDULE EVERY 1 HOUR
    DO
        DELETE FROM sensor_errors
        WHERE id NOT IN (
            SELECT id
            FROM (
                SELECT id
                FROM sensor_errors
                ORDER BY id DESC
                LIMIT 100
            ) AS subquery_alias
        );
    """
]

def setup_event():
    try:
        conn = mariadb.connect(**DB_CONFIG)
        cursor = conn.cursor()
        for sql in SQL_COMMANDS:
            cursor.execute(sql)
        conn.commit()
        print("✅ Scheduled event created to prune sensor_5min_median entries older than 14 days.")
        print("✅ Scheduled event created to prune sensor_errors entries older than 7 days.")
    except mariadb.Error as e:
        print("❌ MariaDB error:", e)
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    setup_event()

