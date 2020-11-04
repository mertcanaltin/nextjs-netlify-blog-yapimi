import Layout from '@components/Layout'

const About = ({ title, description, ...props }) => {
  return (
    <>
      <Layout pageTitle={`${title} | About`} description={description}>
        <h1 className="title">Tekrardan hoşgeldin!</h1>

        <p className="description">
        Bu, Next ile oluşturulmuş basit bir blogdur ve Netlify'de kolayca kurulabilir .{' '}
          <a href="https://netlify.com">Netlify</a>.
        </p>

        <p>
         Beni github üzerinden takip edebilirsin{' '}
          <a href="https://github.com/mertcanaltin">
            Ben!.
          </a>{' '}
         
        
          
        </p>

        <p>
        Bu proje temel bir düzen ve başlık, temel stiller, getStaticPaths ile dinamik yönlendirme ve Markdown olarak kaydedilen gönderiler içerir.
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
