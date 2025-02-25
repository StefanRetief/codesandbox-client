import React, { useEffect } from 'react';

import { useAppState, useActions } from 'app/overmind';
import history from 'app/utils/history';

import {
  Avatar,
  Button,
  Center,
  MainTitle,
  Paragraph,
  SubTitle,
  Wrapper,
  TermsAndUsage,
  Loading,
} from './elements';
import { GitHubIcon } from '../Sandbox/Editor/Workspace/screens/GitHub/Icons';
import { Survey } from './Survey';

export const WaitListRequest = () => {
  const {
    hasLogIn,
    user,
    dashboard,
    isAuthenticating,
    isLoadingGithub,
  } = useAppState();
  const { sandboxPageMounted } = useActions();

  useEffect(() => {
    sandboxPageMounted();
  }, [sandboxPageMounted]);

  if (isAuthenticating || isLoadingGithub) {
    return <Loading />;
  }

  if (!hasLogIn || !user) {
    return <SignIn />;
  }

  if (!user.integrations?.github?.email) {
    return <GitHubScope />;
  }

  const isFeatureFlagBeta = !!dashboard.featureFlags.find(
    e => e.name === 'beta'
  );
  if (isFeatureFlagBeta) {
    // TODO: temp dashboard URL
    history.replace('/dashboard/beta');
    return null;
  }

  return <Survey email={user.email} />;
};

/**
 * Sign in page: GitHub scope
 */
const SignIn: React.FC = () => {
  const { signInGithubClicked } = useActions();

  return (
    <Wrapper>
      <Center>
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginBottom: 40 }}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 50H50V0H0V50ZM44.8864 44.8864V5.11364H5.11364V44.8864H44.8864Z"
            fill="white"
          />
        </svg>

        <MainTitle>Join the waitlist</MainTitle>

        <Paragraph>
          Access is limited to a small group of testers during the Beta of
          CodeSandbox Projects.
        </Paragraph>

        <Button type="button" onClick={signInGithubClicked}>
          <GitHubIcon css={{ width: 16, height: 16 }} />
          <span>Sign in to join</span>
        </Button>
      </Center>

      <TermsAndUsage />
    </Wrapper>
  );
};

/**
 * GitHub token request
 */
const GitHubScope: React.FC = () => {
  const { signInGithubClicked } = useActions();
  const { user } = useAppState();

  return (
    <Wrapper>
      <Center>
        <Avatar src={user.avatarUrl} alt={user.name} />
        <SubTitle>Hey {user.name},</SubTitle>
        <MainTitle>Renew your permission to have access to Projects</MainTitle>
        <Paragraph>
          Access is limited to a small group of testers during the Beta of
          CodeSandbox Projects.{' '}
        </Paragraph>

        <Button type="button" onClick={signInGithubClicked}>
          <GitHubIcon css={{ width: 16, height: 16 }} />
          <span>Sign in to join</span>
        </Button>
      </Center>

      <TermsAndUsage />
    </Wrapper>
  );
};
