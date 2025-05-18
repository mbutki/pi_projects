import mariadb


def main():
    conn = None

    try:
        conn = mariadb.connect(
            user="mbutki",
            host="pi-desk",
            database="pidata"
        )
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)

    conn.autocommit = True
    cur = conn.cursor()
    
    indoor_temp = fetchIndoorTemps(cur)

    conn.commit()
    conn.close()

def fetchIndoorTemps(cur):
    value = 0
    
    print('Fetching indoor temp...')
    try:
        res = cur.execute("SELECT time, location, value from temp_now")
        print('SELECT Executed for indoor temp')
    except mariadb.Error as e:
        print(f"Error: {e}")

    for time, loc, value in cur: 
        value = int(value)
    print(f'HELOOOOO: {value}')
    return value

if __name__ == "__main__":
    main()