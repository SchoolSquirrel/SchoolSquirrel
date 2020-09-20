# Sicherheit

Sicherheit hat wird bei SchoolSquirrel großgeschrieben. Im Folgenden findet sich eine Liste mit Angriffen und Informationen, wie SchoolSquirrel dagegen geschützt ist.

| Angriff / Sicherheitslücke | Schutz |
| ------- | ------ |
| HPP (HTTP Parameter Pollution) | [hpp](https://www.npmjs.com/package/hpp) |
| XSS (Cross-Site-Scripting) | [helmet](https://www.npmjs.com/package/helmet) |
| (D)Dos (Denial of Service) | [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) |
| Allgemeine Programmierfehler | [Static Analysis using DeepCode](https://www.deepcode.ai/) und [GitHub Code Scanning](https://github.com/features/security) |
| Veraltete Pakete und Bibliotheken | [Aktualisierungen mit Dependabot](https://dependabot.com/)