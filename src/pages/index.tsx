import { GetStaticProps } from 'next';
import { FaCalendar, FaUser } from 'react-icons/fa';
import Head from 'next/head';
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

// interface Post {
//   uid?: string;
//   first_publication_date: string | null;
//   data: {
//     title: string;
//     subtitle: string;
//     author: string;
//   };
// }

interface Post {
  title: string
}

interface PostProps {
  posts: Post[]
}


interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ posts }: PostProps) {
  return (
    <>
      <Head>
        <title>Blog | Home</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.info}>
              <FaCalendar className={styles.icons}/>
              <time>15 de mar 2022</time>
              <FaUser className={styles.icons}/>
              <p>Gabriel Zanin</p>
            </div>
          </a>
        </div>

        <div className={styles.posts}>
          <a href="#">
            <strong>Criando um app CRA do zero</strong>
            <p>Tudo sobre como criar a sua primeira aplicação utilizando Create React App</p>
            <div className={styles.info}>
              <FaCalendar className={styles.icons}/>
              <time>15 de mar 2022</time>
              <FaUser className={styles.icons}/>
              <p>Gabriel Zanin</p>
            </div>
          </a>
        </div>

        <div className={styles.posts}>
          <a href="#">
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.info}>
              <FaCalendar className={styles.icons}/>
              <time>15 de mar 2022</time>
              <FaUser className={styles.icons}/>
              <p>Gabriel Zanin</p>
            </div>
          </a>
        </div>

        <div className={styles.posts}>
          <a href="#">
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.info}>
              <FaCalendar className={styles.icons}/>
              <time>15 de mar 2022</time>
              <FaUser className={styles.icons}/>
              <p>Gabriel Zanin</p>
            </div>
          </a>
        </div>

        <button type="button" className={styles.morePosts}>
          Carregar mais posts
        </button>
      </main>
    </>
  )
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query<any>([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: ['posts.title'],
    pageSize: 5,
  });

  const posts = postsResponse.results.map(post => {
    return {
      title: RichText.asText(post.data.title),
    }
  })

  return {
    props: {
      posts
    }
  }
};
