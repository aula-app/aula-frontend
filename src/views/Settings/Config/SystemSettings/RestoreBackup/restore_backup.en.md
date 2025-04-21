Here are the steps to load a MySQL database dump:

## Methode 1. Command-Line

1. Create database and user:

```sql
CREATE DATABASE your_database_name;
CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON your_database_name.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;
```

2. Import the dump file:

```bash
mysql -u your_username -p your_database_name < path/to/dump.sql
```

## Method 2: Using MySQL Workbench (GUI)

1. Install MySQL Workbench
   Download and install MySQL Workbench if it’s not already installed.
2. Connect using root credentials
   Open MySQL Workbench and connect to your MySQL server using your root account.
3. Import the Dump File
   1. Create database: Server > Data Import > Import from Self-Contained File
   2. Select your .sql file
   3. Create new schema (database) or select existing one
   4. Click "Start Import"

Replace your_database_name, your_username, and your_password with your preferred values. Store credentials securely.

If you face access denied errors:

```sql
ALTER USER 'your_username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
```
