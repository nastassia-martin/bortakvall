# Inlämningsuppgift 2 

## Instruktioner
Ni ska samarbeta i grupper om 3 där ni ska göra en enkel webbshop där man ska kunna lägga produkter i en varukorg och därefter ”gå till kassan” och lägga en order.

### G 
- [ ] Vara responsiv
- [ ] Semantiskt korrekt
- [ ] Använda flexboxes alternativt CSS grid (går så klart bra att använda Bootstrap/Tailwind etc.)
- [ ] All data och status ska finnas i JavaScript, dvs ska ej använda DOM som ”single point of truth”
- [ ] Publicerad via Netlify/GitHub Pages/Vercel
- [ ] Samtliga produkter visas med bild (thumbnail), namn, pris och "lägg till"-knapp
- [ ] Kunna lägga till flera exemplar av en produkt i varukorgen
- [ ] Sida med 'läs mer' om produkten (stor bild, namn, pris, beskrivning) utan att varukorg förloras
- [ ] Visa varukorg med sammanställning
- [ ] Kunna ta bort en produkt från varukorgen 
- [ ] En 'gå till kassa'-knapp 
- [ ] Kunna fylla i namn, adress, postnr, ort, telefon (tel ej req), epost
- [ ] Visa eventuella fel när beställning läggs
- [ ] När beställning lyckas, visa ordernr för beställning samt tackmeddelande

### VG 
- [x] Kod skriven i TypeScript
- [ ] Kunna klicka på 'lägg till' flera gånger, men bara 1 rad visas i varukorg
- [ ] Varje produkt har  + -  i varukorg för att öka/minska antal
- [ ] Man ska kunna ta bort en vara på annat sätt än att minska till 0 
- [ ] Varukorg och kundinformation sparas i Local Storage

Uppdatering 2022-12-28
### G 
- [ ] Sortera produkter efter produktnamn.
- [ ] Produkter är inte längre alltid i lager (stock_status: instock vs. stock_status: outofstock), ska visas ändå men inte gå att lägga i varukorgen (“Lägg till i varukorgen”-knapp kan bli disabled).
- [ ] Totala antalet produkter i lager ska visas (t.ex. “Visar 137 produkter varav 42 är i lager”) i översikten över alla produkter.

### VG 
- [ ] Visa hur många (stock_quantity) som finns i lager av varje produkt. Ska ej gå att lägga fler antal av en produkt än vad som finns i lager av produkten.

Uppdatering 2022-12-21
### G 
- [ ] Antal produkter ska visas i produktöversikten.
- [ ] Varukorgen ska visa summa för varje produkt (antal * styckpris) samt ordertotal både i sammanställningen som går att fälla ut och i ”kassan”.


---
## Dokumentation buggar
- ### När man trycker på ett kort registreras ibland ingen produkt
    Task [E2S1T2]

    Lösning: 

- ### Scroll-funktionen fungerar inte när modal är aktiv
    Task [S1S1T1]

    Lösning: 

---
## Links 
- [Figma](https://www.figma.com/team_invite/redeem/k9Suf5Dh06lWW6c343VTVo) 
- [Trello](https://trello.com/invite/b/HDwTnRm8/ATTIcdaf93fca38400346eb3fc1b709cf8ffDEE5AB97/hockey-baby)

