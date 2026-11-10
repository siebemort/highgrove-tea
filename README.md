# Highgrove Tea — Het zetritueel (landingspagina)

Statische site voor GitHub Pages. Geen build-stap nodig om te publiceren: `index.html` is al gegenereerd.

**Live:** https://siebemort.github.io/highgrove-tea/  
**Repository:** https://github.com/siebemort/highgrove-tea  
**MailerLite:** gekoppeld (account `2784145`, formulier `203751631354857167`), getest op 10 november 2026.

| Sectie | Inhoud |
|---|---|
| Hero | *"Thee zet je niet. Thee neem je de tijd voor."* + CTA, boogvenster met de 4 dozen, zetstempel |
| Verhaal | Over Highgrove en CHATHÉ, 2 foto's (open doos, detail logo + touw) |
| De dagboog | De 4 smaken als dagverloop: de zon schuift mee over de boog, de achtergrond kleurt van paars naar avondpaars |
| Ritueel | 4 stappen + de video (16 s) in een boogvenster |
| Inschrijven | Formulier: voornaam, e-mail, theemoment (optioneel), opt-in → MailerLite |

Visuals: hero-foto, 2 verhaalfoto's, 4 vrijgestelde producten, video = ruim boven de vereiste 3.

## Publiceren op GitHub Pages

1. Maak op GitHub een nieuwe **public** repository `highgrove-tea`.
2. Upload de **inhoud** van deze map (niet de map zelf): `index.html`, `privacy.html`, `assets/`, `README.md`, `.nojekyll`. Via de website: *Add file → Upload files*, of:
   ```bash
   cd 10_landingspagina
   git init && git add . && git commit -m "Landingspagina Het zetritueel"
   git branch -M main
   git remote add origin https://github.com/<gebruikersnaam>/highgrove-tea.git
   git push -u origin main
   ```
3. Repository → Settings → **Pages** → Source: *Deploy from a branch* → `main` / `(root)` → Save.
4. Na ± 1 minuut staat de site live. Test de link op desktop én gsm.
5. Andere gebruikersnaam dan `siebemort`? Pas dan `HG_PAGES_URL` aan en bouw de mails en CSV opnieuw:
   ```bash
   export HG_PAGES_URL=https://<gebruikersnaam>.github.io/highgrove-tea
   python3 09_mailerlite/bron/emails.py && python3 06_ai-content/copy/copybank.py && python3 10_landingspagina/bron/build_landing.py
   ```

## MailerLite koppelen

In `index.html` (en `bron/index.template.html`), zoek `id="ml-form"` en vul in:
```html
<form class="form" id="ml-form" data-ml-account="123456" data-ml-form="987654321098765432" novalidate>
```
De getallen staan in de embed-code van je MailerLite-formulier (`…/jsonp/123456/forms/987654321098765432/subscribe`).
Zonder deze twee waarden werkt het formulier in **demo-modus**: het valideert en toont een bedankje, maar verstuurt niets.

Liever de officiële embed-code? Vervang het hele `<form>…</form>` door de code uit MailerLite. `style.css` (sectie *MailerLite-embed*) zet die in de huisstijl.

## Opnieuw genereren
`python3 bron/build_landing.py`: zet de zetstempels (echte Space Grotesk-contouren rond een cirkel) en de vier momenten in `index.html`, en maakt `assets/img/og.jpg`.

## Kwaliteit
- Responsief getest op 1440 px en 390 px (screenshots in `screenshots/`).
- Toetsenbord: zichtbare focus, skip-link, labels bij alle velden, foutmeldingen met `aria-live`.
- `prefers-reduced-motion`: geen zon-animatie, geen automatisch afspelende video.
- Geen trackers of cookies. Fonts lokaal (geen Google Fonts-verzoek).
