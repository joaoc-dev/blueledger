import { Body, Container, Font, Head, Heading, Html, Img, Preview, Section, Tailwind, Text } from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  code: string;
  appName?: string;
  logoSrc?: string;
}

export function WelcomeEmail({ code, appName = 'BlueLedger', logoSrc = '/static/hand-coins.png' }: WelcomeEmailProps): React.ReactElement {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLT1HuS_fvQtMwCp50KnMa1Z0.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{`Use the ${appName} verification code to finish signing in`}</Preview>
      <Tailwind>
        <Body className="m-0 bg-zinc-100 font-sans">
          <Container className="mx-auto my-0 max-w-[520px] rounded-xl bg-white px-6 py-8">
            {logoSrc
              ? (
                  <Section className="mb-6 text-center">
                    <Img src={logoSrc} alt={appName} width={32} height={32} className="mx-auto " />
                  </Section>
                )
              : null}

            <Heading as="h1" className="m-0 mb-3 text-center text-[28px] font-bold leading-9 text-zinc-900">
              Welcome to
              {' '}
              {appName}
            </Heading>

            <Text className="m-0 mb-6 text-center text-[15px] leading-6 text-zinc-700">
              Please verify your email address using the code below to complete your registration.
            </Text>

            <Section className="mx-auto mb-6 max-w-[360px] rounded-lg bg-zinc-100 px-6 py-5 text-center">
              <Text className="m-0 text-3xl font-bold tracking-[0.35em] text-zinc-900">{code}</Text>
            </Section>

            <Text className="m-0 mb-2 text-center text-xs leading-5 text-zinc-500">
              If you didn’t sign up for
              {' '}
              {appName}
              , you can safely ignore this email.
            </Text>
            <Text className="m-0 text-center text-xs leading-5 text-zinc-500">Thank you!</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default WelcomeEmail;
// Props for React Email preview server
export const previewProps: WelcomeEmailProps = {
  code: '123456',
  appName: 'BlueLedger',
  logoSrc: '/static/hand-coins.png',
};
