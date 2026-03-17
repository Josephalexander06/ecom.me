import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full"
    >
      {/* Sweep Transition Panel */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className="fixed inset-0 z-[101] bg-accent-secondary pointer-events-none"
      />
      {children}
    </motion.div>
  );
};

export default PageWrapper;
