import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FaCalendar, FaUser, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
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

export default function Post({ response }) {
  return (
    <>
      {/* <Head>{post.data.title} | Blog</Head> */}

      {/* <main>
        <img src="/images/Logo.svg" alt="Banner" />
        <article className={styles.post}>
          <h1>{post.data.title}</h1>
          <div className={styles.info}>
          <FaCalendar />
          <time>{post.first_publication_date}</time>

          <FaUser />
          <p>{post.data.author}</p>

          <FaClock />
            <p>4 min</p>
          </div>

          <div
            className={styles.postContent}
            // dangerouslySetInnerHTML={{__html: post.}}
          >

          </div>
        </article>



      </main> */}
    </>
  )
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);
  return {
    paths: [],
    fallback: 'blocking' // TODO
  }
};

export const getStaticProps: GetStaticProps = async({ params }) => {
  const { slug } = params
  const prismic = getPrismicClient();

  console.log(slug)

  // const response = await prismic.getByUID<any>(
  //   'posts', uid, {}
  // );
  // const post = {
  //   first_publication_date: '20-05-2022',
  //   // format(new Date(response.last_publication_date), 'dd MMM y',
  //   //   {
  //   //     locale: ptBR,
  //   //   }),
  //   data: {
  //     title: response.data.title,
  //     banner: {
  //       url: response.data.banner,
  //     },
  //     author: response.data.author,
  //     content: {
  //       heading: response.data.content.heading,
  //       body: {
  //         text: response.data.content.body,
  //       }
  //     }
  //   }
  // }


  return {
    props: {
      // response,
    },
    revalidate: 10,
  }

  // TODO
};
