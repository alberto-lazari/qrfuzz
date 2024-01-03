# Background
Controlli sull'input da QR.
Si pensa sempre all'input di testo, ma non QR

Primi test e implementazioni non troppo affidabili.
Crash a caso di Android e rallentamenti e app

Tenere aperta la telecamera per ore la surriscalda

È stato provato a virtualizzare il processo (no problemi fisici), passi le immagini come file e non fotocamera.
Problema -> è fatta su windows, non troppo scalabile

# Proposte di lavoro
## Fare fuzzing con code coverage
Generazione dei QR, prima era fatta a mano, una lista su problemi comuni.
Un QR alla volta

Provare a fare del vero fuzzing basato su coverage

## Riprovare virtualizzazione
Guida fatta su windows, problematica per scalabilità.
Si dovrebbe poter fare un processo per cui si fanno partire un sacco di VM che in parallelo fanno il testing

Riprovare a rifare il tutto meglio e su Linux

## Modo di test più veloce?
Fare un mock della fotocamera e passare immagini

# Idea di lavoro
Provare a vedere un po' Frida e capire come fare il mock.
Se è semplice ci si butta sul fuzzing
