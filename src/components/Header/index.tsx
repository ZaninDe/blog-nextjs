import styles from './header.module.scss'

export default function Header() {
  return (
    <div className={styles.ContentContainer}>
      <img src="/images/Logo.svg" alt="logo" />
    </div>
  )
}
