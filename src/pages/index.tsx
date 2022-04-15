import { GetStaticProps } from 'next';
import { FaCalendar, FaUser } from 'react-icons/fa';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
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
  posts.map(post => {
    console.log(post)
  })
  return (
    <>
      <Head>
        <title>Blog | Home</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {
            posts.map(post => (
              <a href="#">
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <div className={styles.info}>
                  <FaCalendar className={styles.icons}/>
                  <time>{post.first_publication_date}</time>
                  <FaUser className={styles.icons}/>
                  <p>{post.data.author}</p>
                </div>
               </a>
            ))
          }
        </div>

        <button type="button" className={styles.morePosts}>
          Carregar mais posts
        </button>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query<any>([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: ['posts.title', 'posts.subtitle', 'posts.banner', 'posts.author', 'posts.content.Heading', 'posts.content.body'],
    pageSize: 5,
  });

   const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(new Date(post.last_publication_date), 'dd MMM y',
        {
          locale: ptBR,
        }),

      data: {
         title: post.data.title,
         subtitle: post.data.subtitle,
         author: post.data.author,
      }
    }
  });


  return {
    props: {
      posts,
    }
  }
};
