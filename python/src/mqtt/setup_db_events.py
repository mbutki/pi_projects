import mariadb

# --- DB Configuration ---
DB_CONFIG = {
    "host": "localhost",
    "user": "mbutki",
    "password": "",  # No password
    "database": "pi-data"
}

# --- SQL Statements ---
SQL_COMMANDS = [
    "SET GLOBAL event_scheduler = ON;",
    """
    CREATE EVENT IF NOT EXISTS prune_old_sensor_data
    ON SCHEDULE EVERY 1 HOUR
    DO
      DELETE FROM sensor_5min_median
      WHERE end_ts < UNIX_TIMESTAMP(NOW()) - 14 * 86400;
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
    except mariadb.Error as e:
        print("❌ MariaDB error:", e)
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    setup_event()

