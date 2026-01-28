'use client';

import { memo } from 'react';
import styles from './Footer.module.scss';

export const Footer = memo(function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>STARSOFT © TODOS OS DIREITOS RESERVADOS</p>
    </footer>
  );
});
