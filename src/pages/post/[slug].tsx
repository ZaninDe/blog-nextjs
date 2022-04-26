import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FaCalendar, FaUser, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';
import  Prismic  from '@prismicio/client';
import { useRouter } from 'next/router'
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { route } from 'next/dist/next-server/server/router';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {

  const formatedPosts =  {

      ...post,
      first_publication_date:
      format(new Date(post.first_publication_date), 'dd MMM yyyy',
        {
          locale: ptBR,
        }),
  }

  const router = useRouter()

  if(router.isFallback) {
    return <h1>Carregando...</h1>
  }

  return (
    <>
      <Head>
        <title>{formatedPosts.data.title} | Blog</title>
      </Head>


        <img className={styles.banner} src={formatedPosts.data.banner.url} alt="Banner" />
        <article className={styles.main}>
          <h1 className={styles.title} >{formatedPosts.data.title}</h1>
          <div className={styles.info}>
            <FaCalendar className={styles.icons}/>
            <time>{formatedPosts.first_publication_date}</time>

            <FaUser className={styles.icons}/>
            <p>{formatedPosts.data.author}</p>

            <FaClock className={styles.icons}/>
              <p>4 min</p>
          </div>

          {formatedPosts.data.content.map(content => {
            return (
              <article>
                <h2>{content.heading}</h2>
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{__html: RichText.asHtml(content.body)}}
              />
              </article>
            )
          })}
        </article>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts'),
  ])

  const paths = posts.results.map(post => {
    return {
      params: {
        slug:post.uid,
      }
    }
  })

  return {
    paths,
    fallback: true,
  }
};

export const getStaticProps: GetStaticProps = async({ params }) => {
  const { slug } = params
  const prismic = getPrismicClient();


  const response = await prismic.getByUID<any>(
    'posts', String(slug), {}
  )

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,

    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [...content.body]
        }
      })
    }
  }




  return {
    props: {
      post
    },
    revalidate: 10,
  }
};
