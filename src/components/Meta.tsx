import Head from 'next/head'

interface IProps {
  title?: string
  keywords?: string
  description?: string
}

const Meta: React.FC<IProps> = ({ title, keywords, description }) => {
  return (
    <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='keywords' content={keywords} />
      <meta name='description' content={description} />
      <meta charSet='utf-8' />
      <link rel='icon' href='/favicon.ico' />
      <title>{title}</title>
    </Head>
  )
}

Meta.defaultProps = {
  title: 'Tokenverse',
  keywords:
    'tokenverse, nft, non-fungible tokens, cryptocurrency, metaverse, ethereum, polygon',
  description:
    'Tokenverse is a revoluntionary way to design and create your own NFTs',
}

export default Meta
