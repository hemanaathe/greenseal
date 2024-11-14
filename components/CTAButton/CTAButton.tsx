"use client";

import { motion } from "framer-motion";
import styles from "./CTAButton.module.css";
import Link from "next/link";

const CTAButton = () => {
  return (
    <>
      <Link
        href={{
          pathname: "/community",
        }}
      >
        <motion.button
          className={styles.ctaButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Explore Community
        </motion.button>
      </Link>
    </>
  );
};

export default CTAButton;
