/**
 * Purpose:
 * To illustrate the composition of a Emotion Component
 */

/** @jsxRuntime classic /
/* @jsx jsx */
import { css, jsx } from '@emotion/react';
 
const buttonStyle = css({
  padding: '32px',
  backgroundColor: 'navy',
  fontSize: '24px',
  borderRadius: '4px',
  ':hover': {
    color: 'white',
  },
});
 
const EmotionButton = () => {
  return <div css={buttonStyle}>Hover to change color.</div>;
};
 
export default EmotionButton;