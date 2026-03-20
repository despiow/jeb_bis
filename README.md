# JEB - Jeux en Bois

Site vitrine pour une entreprise de prestations de jeux en bois : animations et location.

## Structure

- **index.html** – Page principale avec toutes les sections
- **css/style.css** – Styles responsive
- **js/main.js** – Navigation mobile, fil d'Ariane
- **contact.php** – Envoi des emails (optionnel)
- **assets/** – Logo et images

## Personnalisation

### Logo
Remplacez `assets/logo.svg` par votre propre logo. Le texte "JEB" s'affiche si l'image ne charge pas.

### Images
Les images utilisent actuellement des placeholders Unsplash. Remplacez les URLs dans le HTML par vos propres images (dans `assets/images/` par exemple).

### Vidéos
Dans la section Vidéos, remplacez les `.video-placeholder` par de vraies balises :

```html
<video controls poster="votre-image.jpg">
  <source src="votre-video.mp4" type="video/mp4">
</video>
```

Ou une iframe YouTube/Vimeo :

```html
<iframe src="https://www.youtube.com/embed/VOTRE_VIDEO_ID" allowfullscreen></iframe>
```

### Formulaire de contact

**Option 1 – PHP (hébergement avec PHP)**  
1. Ouvrez `contact.php` et modifiez `$destinataire = 'votre-email@exemple.com'`
2. Le formulaire envoie déjà vers `contact.php`
3. Le mail reçu contient : expéditeur, objet et corps du message

**Option 2 – Formspree (sans serveur)**  
1. Créez un compte sur [formspree.io](https://formspree.io)
2. Créez un formulaire et récupérez l’URL (ex. `https://formspree.io/f/xxxxx`)
3. Dans `index.html`, remplacez `action="contact.php"` par `action="https://formspree.io/f/VOTRE_ID"`

### Réseaux sociaux
Dans le footer, remplacez les `href="#"` des liens sociaux par vos URLs Facebook, Instagram, LinkedIn, etc.

### SEO (référencement Google)
Le site inclut déjà des balises SEO. **À personnaliser avant mise en ligne** :

1. **URL du site** : Remplacez `https://votresite.com` par votre vraie URL dans :
   - `index.html` (balises canonical, og:url, og:image, twitter:image, JSON-LD)
   - `sitemap.xml` (balise loc)
   - `robots.txt` (Sitemap)

2. **Image Open Graph** : Créez `assets/og-image.jpg` (1200×630 px recommandé) pour l’aperçu sur les réseaux sociaux et Google.

3. **Google Search Console** : Une fois en ligne, enregistrez votre site sur [search.google.com/search-console](https://search.google.com/search-console) et envoyez votre sitemap.

4. **Mots-clés** : Adaptez la balise `meta keywords` dans `index.html` selon votre zone géographique et vos services.

## Lancer le site en local

Ouvrez `index.html` dans un navigateur ou utilisez un serveur local :

```bash
# Avec Python
python -m http.server 8000

# Avec Node.js (npx)
npx serve
```

Pour tester le formulaire PHP, un serveur avec PHP est nécessaire (XAMPP, WAMP, ou `php -S localhost:8000`).
