# Inlämningsuppgift 2 

## Instruktioner
Ni ska samarbeta i grupper om 3 där ni ska göra en enkel webbshop där man ska kunna lägga produkter i en varukorg och därefter ”gå till kassan” och lägga en order.

### G 
- [x] Vara responsiv
- [x] Semantiskt korrekt
- [x] Använda flexboxes alternativt CSS grid (går så klart bra att använda Bootstrap/Tailwind etc.)
- [x] All data och status ska finnas i JavaScript, dvs ska ej använda DOM som ”single point of truth”
- [x] Publicerad via Netlify/GitHub Pages/Vercel
- [x] Samtliga produkter visas med bild (thumbnail), namn, pris och "lägg till"-knapp
- [x] Kunna lägga till flera exemplar av en produkt i varukorgen
- [x] Sida med 'läs mer' om produkten (stor bild, namn, pris, beskrivning) utan att varukorg förloras
- [x] Visa varukorg med sammanställning
- [x] Kunna ta bort en produkt från varukorgen 
- [x] En 'gå till kassa'-knapp
- [x] Kunna fylla i namn, adress, postnr, ort, telefon (tel ej req), epost
- [x] Visa eventuella fel när beställning läggs
- [x] När beställning lyckas, visa ordernr för beställning samt tackmeddelande

### VG 
- [x] Kod skriven i TypeScript
- [x] Kunna klicka på 'lägg till' flera gånger, men bara 1 rad visas i varukorg
- [x] Varje produkt har  + -  i varukorg för att öka/minska antal
- [x] Man ska kunna ta bort en vara på annat sätt än att minska till 0 
- [x] Varukorg och kundinformation sparas i Local Storage

Uppdatering 2022-12-28
### G 
- [x] Sortera produkter efter produktnamn.
- [x] Produkter är inte längre alltid i lager (stock_status: instock vs. stock_status: outofstock), ska visas ändå men inte gå att lägga i varukorgen (“Lägg till i varukorgen”-knapp kan bli disabled).
- [x] Totala antalet produkter i lager ska visas (t.ex. “Visar 137 produkter varav 42 är i lager”) i översikten över alla produkter.

### VG 
- [x] Visa hur många (stock_quantity) som finns i lager av varje produkt. Ska ej gå att lägga fler antal av en produkt än vad som finns i lager av produkten.

Uppdatering 2022-12-21
### G 
- [x] Antal produkter ska visas i produktöversikten.
- [x] Varukorgen ska visa summa för varje produkt (antal * styckpris) samt ordertotal både i sammanställningen som går att fälla ut och i ”kassan”.

---
## Dokumentation buggar

---
## Links 
- [Figma](https://www.figma.com/team_invite/redeem/k9Suf5Dh06lWW6c343VTVo) 
- [Trello](https://trello.com/invite/b/HDwTnRm8/ATTIcdaf93fca38400346eb3fc1b709cf8ffDEE5AB97/hockey-baby)

