import { GetStaticProps } from 'next';
import { FaCalendar, FaUser } from 'react-icons/fa';
import Head from 'next/head';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useState } from 'react';

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

export default function Home({ postsPagination }: HomeProps): JSX.Element{

  const formatedPosts = postsPagination.results.map(post => {
    return {
      ...post,
      first_publication_date:
      format(new Date(post.first_publication_date), 'dd MMM yyyy',
        {
          locale: ptBR,
        }),
    }
  });

  const [posts, usePosts] = useState<Post[]>(formatedPosts)
  return (
    <>
      <Head>
        <title>Blog | Home</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {
            posts.map(post => (
              <Link key={post.uid} href={`/post/${post.uid}`}>
                <a >
                  <strong>{post.data.title}</strong>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.info}>
                    <FaCalendar className={styles.icons}/>
                    <time>{post.first_publication_date}</time>
                    <FaUser className={styles.icons}/>
                    <p>{post.data.author}</p>
                  </div>
               </a>
              </Link>
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
    pageSize: 1,
  });



   const posts = postsResponse.results.map(post => {


    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
         title: post.data.title,
         subtitle: post.data.subtitle,
         author: post.data.author,
      }
    }
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  }

  return {
    props: {
      postsPagination,
    }
  }
};
