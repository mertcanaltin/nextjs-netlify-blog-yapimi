# # Next 9.4 ve Netlify ile bir Markdown blogu oluşturma

Dikkat edin, bu eğitimde React, JavaScript ve CSS bildiğinizi varsayıyoruz. Bu cephelerden herhangi birinde yardıma ihtiyacınız olursa, [Netlify Topluluğunda](https://community.netlify.com/) soru sormaktan çekinmeyin !

Bir Next Js projesi oluştur      
> Kopyala
>npx create-next-app nextjs-blog --use-npm --example "https://github.com/vercel/next-learn-starter/tree/master/learn-starter"
```

# Proje dizininiz bu şekilde olmalı 
components/
pages/
  post/
posts/
public/
  static/
```

Editörünüzde hep birlikte böyle görünmesi gerekir:

![enter image description here](https://cdn.netlify.com/34cb692e1d3233a2f380b059ad0f71cd7d1784da/975d9/img/blog/screen-shot-2020-05-04-at-9.40.57-am.png)

## ## Hadi kodlayalım!

Artık her şeyi ayarladığımıza göre, gidin ve her şeyi `index.js`bununla değiştirin :

```jsx
const Index = ({ title, description, ...props }) => {
  return <div>Merhaba Dünya</div>
}

export default Index

export async function getStaticProps() {
  const configData = await import(`../siteconfig.json`)

  return {
    props: {
      title: configData.default.title,
      description: configData.default.description,
    },
  }
}
```

## Terminalinizde koşun `npm run dev` ve işte! Bir Sonraki uygulamamız hazır ve çalışıyor!

Muhtemelen React'i biliyorsanız, bu `index.js`dosya çok şaşırtıcı değil. `getStaticProps`Yine de bu işlevi size açıklamak isterim . Next 9.3'te yayınlandı. Bu işlev, verileri almanıza ve sayfa bileşenine destek olarak döndürmenize olanak tanır. Sen kullanabilirsiniz `getStaticProps`(eğer gelen getirilirken, burada gördüğünüz gibi yerel veri getirmek için `siteconfig.json`dosyası) veya harici API'ler ve kütüphaneler. Bu işlev yalnızca `pages`dizindeki sayfa bileşenlerinde çalışacaktır ! Sayfa, derleme zamanında oluşturulacak ve bu verileri alt bileşenlerine aktarabilirsiniz. Şimdi bu alt bileşenlerden bazılarını uygulayalım, böylece eylem halinde çalıştığını görebilirsiniz.


##  Bileşenler!
Şimdi, burada görünen bazı gerçek yönlendirme ve bileşenler elde etmek istiyoruz. Let bileşenleri ile başlar ve bizim iç üç JS dosyalarına yapmak `components`adlı klasörün, `Header.js`, `Layout.js`, ve `PostList.js`.

-   `Header.js`Dosya sitemiz başlığını ve navigasyon içerecektir.
-   `PostList.js`Tahmin edebileceğiniz gibi dosya, blog mesajları listeler.
-   `Layout.js`Dosya sulu biridir. Başlığımızı çekecek, `<head>`HTML etiketini dolduracak, sitenin tuttuğu tüm içeriği içerecek ve oraya da bir altbilgi atacak.

Önce uygulayalım `Layout.js`ve ana sayfamızdan alalım . Açın `Layout.js`ve şuraya koyun:

```jsx
import Head from 'next/head'
import Header from './Header'

export default function Layout({ children, pageTitle, ...props }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
      </Head>
      <section className="layout">
        <div className="content">{children}</div>
      </section>
      <footer>Benim kurduğum!</footer>
    </>
  )
}
```

Dikkat `Head`gelen bileşeni `next/head`burada. Sırada, `<head>`işlenmiş HTML sayfanıza etiket eklemek istediğinizde bu öğeyi kullanırsınız! Bu örneğe sadece bir `<meta>`etiket `<title>`ekledim, ancak bunu kalbinizin içeriğine göre doldurabilirsiniz.

Dosyanın geri kalanı, düzenimiz için bazı temel blokları oluşturuyor. Şimdi, `index.js`"merhaba dünyamıza" gidip `<div>`bununla değiştirelim :

```diff-jsx
const Index = ({ title, description, ...props }) => {
+  return (
+    <Layout pageTitle={title}>
+      <h1 className="title">Welcome to my blog!</h1>
+      <p className="description">
+        {description}
+      </p>
+      <main>
+        Posts go here!
+      </main>
+    </Layout>)
}
```
Ayrıca `Layout`index.js'nin en üstündeki bileşeni içe aktardığınızdan emin olun :

```jsx
import Layout from '../components/Layout'
```
Pekala, tarayıcıdan sitemize bakalım!

localhost:3000 a baktığınız zaman paragrafı ve props da ki verileri görebilirsiniz 

 Orada paragraftaki açıklamanın ve tarayıcı sekmesindeki başlığın bizden nasıl geldiğine dikkat edin `getStaticProps`. Gerçek verileri kullanıyoruz!

Şimdi bir `Header`bileşen ekleyelim . Açın `Header.js`ve buraya ekleyin:

```jsx
import Link from 'next/link'

export default function Header() {
  return (
    <>
      <header className="header">
        <nav className="nav">
          <Link href="/">
            <a>My Blog</a>
          </Link>
          <Link href="/about">
            <a>About</a>
          </Link>
        </nav>
      </header>
    </>
  )
}
```
Pekala, bunu biraz ayıralım. `Link`Etiketin kullanımına dikkat edin . Rotalarınız arasındaki istemci tarafı geçişleri bununla etkinleştirilir. Orada yerleşik oldukça güzel bir API var ( [buradan](https://nextjs.org/docs/api-reference/next/link) kontrol edin ), ancak bu örnek için bilmeniz gereken 2 şey, `href`gerekli olan tek prop (ve `pages`dizinin içinden bir yolu işaret ediyor ve `<a>`Bağlantıları sitenizin SEO'suna uygun şekilde oluşturmak için oraya bir bileşen yerleştirin .

Okie dokie, şimdi bu bileşeni yaptığımıza göre, onu `Layout`bileşenimize çekelim . Elimizdeki `<Header />`etiketin tam üstüne bir etiket yerleştirin `<section>`. `Header`Bileşeni daha önce içe aktardık , bu nedenle yüklemesi için yapmanız gereken tek şey bu olmalı!

```diff-jsx
export default function Layout({ children, pageTitle, ...props }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
      </Head>
      <section className="layout">
 +        <Header />
        <div className="content">{children}</div>
      </section>
      <footer>Built by me!</footer>
    </>
  )
}
```
Tarayıcıda kontrol edelim.
localhost:3000 a baktığımız zaman linkimizin geldiğini görüyoruz 
Navigasyonumuz var millet! Yine de, Hakkında bağlantısını tıklarsanız 404 aldığımızı fark edebilirsiniz. Bunu düzeltmeliyiz.

### Daha fazla sayfa bileşeni ekleme

Tamam, şimdi navigasyon devam ettiğimize göre, gidecek şeylere sahip olmamız gerekecek (özellikle de gönderilerimiz gittiğinde).

Klasörde bir `about.js`dosya oluşturun `pages`ve şuna benzer bir şeyle doldurun:

```jsx
import Layout from '../components/Layout'

const About = ({ title, description, ...props }) => {
  return (
    <>
      <Layout pageTitle={`${title} | About`} description={description}>
        <h1 className="title">Welcome to my blog!</h1>

        <p className="description">
          {description}
        </p>

        <p>
          I am a very exciting person. I know this because I'm following a very exciting tutorial, and a not-exciting person wouldn't do that.
        </p>
      </Layout>
    </>
  )
}

export default About

export async function getStaticProps() {
  const configData = await import(`../siteconfig.json`)

  return {
    props: {
      title: configData.default.title,
      description: configData.default.description,
    },
  }
}
```
Bu bizim `index.js`dosyamıza çok benziyor ve şimdilik harika. Onu ne olursa olsun doldurabilirsin ve isterseniz buraya daha fazla dosya ekleyebilirsiniz. Ancak şimdilik tarayıcımıza geri dönelim ve navigasyondaki Hakkında bağlantısını tıklayalım.

localhost:3000  a tarayıcımız üzerinden baktığımız zaman 
sayfalarımız var! Heyecanlandın mı Ben heyecanlıyım. Biraz daha heyecanlanalım ve **dinamik rotalardan** bahsedelim .

## Dinamik Rotalar

Şu anda, sayfalar arasında gezinmek istediğinizde, bunun için bir dosya oluşturmamız gerektiğini biliyoruz ve rota var. Dizinde bir `ilovenetlify.js`dosya oluşturursak `pages`, gidebiliriz `localhost:3000/ilovenetlify`ve çalışırdı. Peki ya dinamik başlıklara sahip blog yazılarımız olduğunda ve rotalarımıza bu başlıkların adını vermek istediğimizde ne olacak? Endişelenme, Next'in sizin için bir çözümü var.

Devam edin ve `pages/post`adlı bir dosya oluşturun `[postname].js`, Oh gee, dosya adında köşeli parantezler var! Next, dinamik bir rotanız olduğunu böyle bilir. Dosya yolu `pages/post/[postname].js`olarak bitecekti `localhost:3000/post/:postname`tarayıcıda! Doğru, burada hem iç içe bir rotamız hem de dinamik bir rotamız var. Biri web geliştirme polisini arasın, bir şeyin peşindeyiz!

## Markdown işleniyor

Yerleştirmeden önce `[postname].js`, projemize birkaç şey daha eklemeliyiz.

```shell
npm install react-markdown gray-matter raw-loader
```
-   React Markdown, Markdown dosyalarını ayrıştırıp işleyen bir kütüphanedir.
-   Gray Matter, blog yayınlarımızın YAML "ön maddesini" (Markdown yayınlarımızın ihtiyaç duyacağımız meta verilerle birlikte kısımlarını) ayrıştıracaktır.
-   Raw Loader, Markdown dosyalarımızı web paketi ile içe aktarmamızı sağlayacak bir yükleyicidir.

Şimdi, `next.config.js`en üst düzeyde bir dosya oluşturun ve şununla doldurun:

```javascript
module.exports = {
  target: 'serverless',
  webpack: function (config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  },
}
```

**Not:** Bu dosyayı ekledikten sonra muhtemelen dev sunucunuzu yeniden başlatmanız gerekecek!

Hala benimle? Artık bu kütüphaneleri kurduğumuza göre, aslında `[postname].js`hepsini kullanmak için kurabiliriz . Bunu dosyaya yapıştırın:

```jsx
import Link from 'next/link'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'

import Layout from '../../components/Layout'

export default function BlogPost({ siteTitle, frontmatter, markdownBody }) {
  if (!frontmatter) return <></>

  return (
      <Layout pageTitle={`${siteTitle} | ${frontmatter.title}`}>
        <Link href="/">
          <a>Back to post list</a>
        </Link>
        <article>
          <h1>{frontmatter.title}</h1>
          <p>By {frontmatter.author}</p>
          <div>
            <ReactMarkdown source={markdownBody} />
          </div>
        </article>
      </Layout>
  )
}

export async function getStaticProps({ ...ctx }) {
  const { postname } = ctx.params

  const content = await import(`../../posts/${postname}.md`)
  const config = await import(`../../siteconfig.json`)
  const data = matter(content.default)

  return {
    props: {
      siteTitle: config.title,
      frontmatter: data.data,
      markdownBody: data.content,
    },
  }
}

export async function getStaticPaths() {
  const blogSlugs = ((context) => {
    const keys = context.keys()
    const data = keys.map((key, index) => {
      let slug = key.replace(/^.*[\\\/]/, '').slice(0, -3)

      return slug
    })
    return data
  })(require.context('../../posts', true, /\.md$/))

  const paths = blogSlugs.map((slug) => `/post/${slug}`)

  return {
    paths,
    fallback: false,
  }
}
```
Vay canına, bu uzun bir soru, o yüzden onu parçalayalım.

-   İçinde `getStaticProps`, `posts`dizinde bulunan Markdown dosyalarını çekiyoruz . Ayrıca `siteconfig.json`, sitenin başlığını tarayıcı sekmesi için almak için tekrar alıyoruz . Ön konuyu blog yazılarımızda ayrıştırmak için Gri Madde kullanıyoruz. Daha sonra bunların tümünü bileşen için destek olacak şekilde döndürürüz.
-   Ayrıca `getStaticPaths`Next 9.3'te yeni olan bir de var . Bu işlev, derleme sırasında HTML'ye dönüştürülmesi gereken yolların bir listesini tanımlar. Yani, burada yaptığımız şey, `posts`dizindeki tüm Markdown dosyalarımızı almak , dosya adlarını ayrıştırmak, her dosya adına göre bir sümüklü böcek listesi tanımlamak ve bunları geri döndürmektir. Ayrıca `fallback`yanlış olan a döndürür, böylece bir şeyler düzgün eşleşmiyorsa 404 sayfa görünür.
-   In `BlogPost`bileşenin kendisi, içinde bize verilen değerleri kullanmak `getStaticProps`bir doldurmak için `Layout`bizim blog yazısı içerikli bileşeni.

Pekala! Henüz çok fazla sonuç görmeden çok iş yaptık. Bunu değiştirelim. Dizinde en üst düzeyde bir `mypost.md`dosya oluşturun `posts/`ve şuna benzer bir şeyle doldurun:

```markdown
---
title: 'Hello, world!'
author: 'Cassidy'
---

Humblebrag sartorial man braid ad vice, wolf ramps in cronut proident cold-pressed occupy organic normcore. Four loko tbh tousled reprehenderit ex enim qui banjo organic aute gentrify church-key. Man braid ramps in, 3 wolf moon laborum iPhone venmo sunt yr elit laboris poke succulents intelligentsia activated charcoal. Gentrify messenger bag hot chicken brooklyn. Seitan four loko art party, ut 8-bit live-edge heirloom. Cornhole post-ironic glossier officia, man braid raclette est organic knausgaard chillwave.

- Look at me
- I am in a list
- Woo hoo

```

Bunun için [Hipster Ipsum](https://hipsum.co/) kullandım , ama her neyse onu doldurabilirsiniz. En üstteki ön maddede, yalnızca bir başlığımız ve yazarımız var çünkü `BlogPost`bileşenimizde tek kullandığımız bu . Bileşende kullandığınız sürece buraya istediğinizi ekleyebilirsiniz (örneğin tarih gibi).

Yaptık! `localhost:3000/post/mypost`Tüm sıkı çalışmanıza gidin ve tanık olun!

## Yazılarımızı listelemek

Artık dinamik rotalarla Markdown blog gönderileri yapabildiğimize göre, blogumuzun ana sayfasında yaptığımız tüm blog gönderilerini listelemeye çalışmalıyız. `PostList.js`Daha önce rehberimizde yaptığımız iyi bir şey `components/`! Bu kodu o dosyaya yazın:

```jsx
import Link from 'next/link'

export default function PostList({ posts }) {
  if (posts === 'undefined') return null

  return (
    <div>
      {!posts && <div>No posts!</div>}
      <ul>
        {posts &&
          posts.map((post) => {
            return (
              <li key={post.slug}>
                <Link href={{ pathname: `/post/${post.slug}` }}>
                  <a>{post.frontmatter.title}</a>
                </Link>
              </li>
            )
          })}
      </ul>
    </div>
  )
}

```

Şimdi, destek olarak aktarılan gönderi verilerini nasıl kullanmak istediğimize dikkat edin. Bunu yapmak zorunda kalacağız `index.js`. Kafa geri oraya ve koyun `<PostList />`içinde `<main>`etiketi ve şöyle üstündeki içe:

```diff-jsx
+ import PostList from '../components/PostList'

const Index = ({ posts, title, description, ...props }) => {
  return (
    <Layout pageTitle={title}>
      <h1 className="title">Welcome to my blog!</h1>
      <p className="description">{description}</p>
      <main>
 +        <PostList />
      </main>
    </Layout>
  )
}

```

Örneğin, posta verilerimiz gibi harici verileri almak istediğimizde ne yaparız? Kullanıyoruz `getStaticProps`! Aşağı kaydırın ve işlevi şöyle görünecek şekilde değiştirin:

```javascript
export async function getStaticProps() {
  const configData = await import(`../siteconfig.json`)

  const posts = ((context) => {
    const keys = context.keys()
    const values = keys.map(context)

    const data = keys.map((key, index) => {
      let slug = key.replace(/^.*[\\\/]/, '').slice(0, -3)
      const value = values[index]
      const document = matter(value.default)
      return {
        frontmatter: document.data,
        markdownBody: document.content,
        slug,
      }
    })
    return data
  })(require.context('../posts', true, /\.md$/))

  return {
    props: {
      posts,
      title: configData.default.title,
      description: configData.default.description,
    },
  }
}

```

`posts`Buraya Markdown dosyalarını çeken, onları ayrıştıran (daha önce yaptığımız gibi) ve sonra bu `posts`değişkeni için props'a geçiren bir değişken ekledik `Index`. Şimdi `index.js`dosyanızın geri kalanı şöyle görünmeli:

```jsx
import matter from 'gray-matter'

import Layout from '../components/Layout'
import PostList from '../components/PostList'

const Index = ({ posts, title, description, ...props }) => {
  return (
    <Layout pageTitle={title}>
      <h1 className="title">Welcome to my blog!</h1>
      <p className="description">{description}</p>
      <main>
        <PostList posts={posts} />
      </main>
    </Layout>
  )
}

export default Index

```


`matter`Ön konuyu ayrıştırmak için içe aktardık , `posts`destek olarak geçtik ve ardından `PostList`gerçek gönderilerin bir listesini alabilmek için bunu derinlemesine inceledik. Tarayıcımıza bakalım!


Yaşasın!! Bir gönderi listemiz var !! Şimdi, `posts`dizinimize bir Markdown dosyası eklediğimizde , burada listede görünecektir.

## İsteğe bağlı özelleştirme

Şu anda stil konusuna girmeyeceğim, ancak [son demoyu](https://github.com/cassidoo/next-netlify-blog-starter) yerleşik olarak görmek isterseniz , devam edin! Next 9.4, stilli jsx, Sass, CSS Modüllerini ve daha fazlasını kutudan çıkarır, böylece tercih ettiğiniz her şeyi kullanabilirsiniz.

Next 9.4'te, kodunuza mutlak içe aktarımlar ekleme yeteneğini yayınladılar ( [bu blog yazısında](https://url.netlify.com/rJpH3US28) bundan daha fazla bahsedeceğim ). İçe aktarımlarınızı temizlemek istiyorsanız (kimse hepsini yazmayı sevmiyorsa `../../etc`), `jsconfig.json`projenizin en üst seviyesine aşağıdaki gibi görünen bir a ekleyebilirsiniz :

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@components/*": ["components/*"],
      "@utils/*": ["utils/*"]
    }
  }
}

```

Şimdi bununla, bileşenlerinize erişmek istediğinizde, `@components/something`yerine yazabilirsiniz `../../components/something`. Eylem halinde görmek için demo projesine göz atın!

## Netlify'e Dağıtma

ÇOK yolculuktaydık millet. Blogumuzu dünyanın görmesi için çevrimiçi hale getirelim. Dizininizin en üst düzeyinde çağrılan bir dosya oluşturun `netlify.toml`ve şununla doldurun:

```yaml
[build]
  command = "npm run build && npm run export"
  publish = "out"

```

`command`Burada Netlify yapı için kullanmak ve son siteyi paketlemek edeceği “Build'a Komut” bahsediyor. `publish`İnşa donatılacak sonra yer alacak dizine bahsediyor! Next.js, `out`başka türlü yapılandırmadığınız sürece her zaman dizine dışa aktarır .

Ardından, `package.json`cihazınızı açın ve bunu `scripts`altına ekleyin `"start"`:

```json
"export": "next export"

```

Şaşırtıcı bir şekilde, projenizi Netlify için kurmak için ihtiyacınız olan tek şey bu! Kodunuzu favori platformunuzdaki bir depoya gönderin.

Şimdi, Netlify'de oturum açın ve “Git'ten yeni site” ye tıklayın ve deponuzu seçmek için komut istemlerini izleyin. Eğer Çünkü `netlify.toml`dosya zaten yapılmış, inşa ayarları zaten sizin için dışarı doldurulmalıdır:

  
![Netlify'de "yeni site oluştur"](https://cdn.netlify.com/ee37318ca78895f6748b3757026cdd6e2cc840de/38d20/img/blog/10e549df-2c88-4762-9a9f-ba7c3e560914.png "Netlify'de yeni bir site oluşturmak")

O parlak "Siteyi dağıt" düğmesine tıklayın ve birkaç dakika içinde siteniz yayına girer !! Sen yaptın!! Ve projenizde her değişiklik yaptığınızda ve bunları GitHub deponuza aktardığınızda siteniz otomatik olarak yeniden oluşturulur. Ne kadar serin??


https://mertcanaltin.netlify.app/

## Sen yaptın!

Tebrikler. Uzun bir yolculuktu, ancak optimize edilmiş bir statik site oluşturmak için dinamik yönlendirme ve Next'teki en yeni ve en büyük işlevlerle tamamlanmış bir Next 9.4 destekli Markdown blogu oluşturdunuz. Ve tabii ki, onu Netlify'ye dağıttınız ve siz onu güncellemeye devam ettiğiniz sürece güncellenmeye devam edecek.

Seninle gurur duyuyorum ve umarım bugün bir şeyler öğrenmişsindir! Sorularınız olursa [Topluluğumuza gidin](https://community.netlify.com/) ve sizi sıralayalım!



[![Cassidy Williams](https://cdn.netlify.com/27476c108aef07119b88d75aa0361438bf4ad062/43905/img/blog/authors/thumbnails/cassidy-williams.jpg)](https://www.netlify.com/authors/cassidy-williams)

[Cassidy Williams](https://www.netlify.com/authors/cassidy-williams) tarafından yazıldı.[](https://www.netlify.com/authors/cassidy-williams)

hiçbir şekilde ticari amaç için çevirilmemiştir tamamen türkçe dilinde bilgiyi yaymak amacı ile çevrilmiş yazıdır kendisine çok teşekkürler

Yayınlandığı [Kılavuzları & Rehberler](https://www.netlify.com/topics/tutorials) üzerinde 4 Mayıs 2020

