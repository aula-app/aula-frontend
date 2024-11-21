# So stellen Sie ein Backup Ihrer Datenbank wieder her:
## Methode 1: Kommandozeile
1. Datenbank und Benutzer erstellen:
```sql
CREATE DATABASE ihr_datenbank_name;
CREATE USER 'ihr_benutzername'@'localhost' IDENTIFIED BY 'ihr_passwort';
GRANT ALL PRIVILEGES ON your_database_name.* TO 'your_username'@'localhost';
FLUSH-PRIVILEGIEN;
```
2. Importieren Sie die Dump-Datei:
```bash
mysql -u Ihr_Benutzername -p Ihr_Datenbankname < Pfad/zu/dump.sql
```

## Methode 2: MySQL Workbench (Grafische Benutzeroberfläche)
1. MySQL Workbench installieren
Laden Sie MySQL Workbench herunter und installieren Sie es, falls es noch nicht installiert ist.
2. Verbinden Sie sich mit Root-Zugangsdaten
Öffnen Sie MySQL Workbench und verbinden Sie sich mit Ihrem MySQL-Server unter Verwendung Ihres Root-Kontos.
3. Importieren Sie die Dump-Datei
    1. Erstellen Sie eine Datenbank: Server > Datenimport > Import aus eigenständiger Datei 
    2. Wählen Sie Ihre .sql-Datei
    3. Erstellen Sie ein neues Schema (Datenbank) oder wählen Sie ein bestehendes aus
    4. Klicken Sie auf „Import starten“.
Ersetzen Sie „Ihr_Datenbankname“, „Ihr_Benutzername“ und „Ihr_Passwort“ durch die von Ihnen gewünschten Werte. Speichern Sie die Anmeldedaten sicher.

Wenn Sie eine Zugriffsverweigerungsmeldung erhalten:
```sql
ALTER USER 'your_username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
```

