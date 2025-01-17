import { css } from '@emotion/react';
import { borderRadius, iconSize, shadows, spacing, theme } from '@expo/styleguide';
import React, { PropsWithChildren, ReactNode } from 'react';

import { HEADLINE } from '~/ui/components/Text';
import { TriangleDownIcon } from '~/ui/foundations/icons';

type CollapsibleProps = PropsWithChildren<{
  /** The content of the collapsible summary */
  summary: ReactNode;
  /** If the collapsible should be rendered "open" by default */
  open?: boolean;
  testID?: string;
}>;

export function Collapsible({ summary, open, testID, children }: CollapsibleProps) {
  return (
    <details css={detailsStyle} open={open} data-testid={testID}>
      <summary css={summaryStyle}>
        <TriangleDownIcon css={markerStyle} size={iconSize.small} />
        <HEADLINE tag="span" css={headlineStyle}>
          {summary}
        </HEADLINE>
      </summary>
      <div css={contentStyle}>{children}</div>
    </details>
  );
}

const detailsStyle = css({
  overflow: 'hidden',
  background: theme.background.default,
  border: `1px solid ${theme.border.default}`,
  borderRadius: borderRadius.medium,
  padding: 0,

  '&[open]': {
    boxShadow: shadows.micro,
  },
});

const summaryStyle = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  userSelect: 'none',
  listStyle: 'none',
  backgroundColor: theme.background.secondary,
  padding: spacing[1.5],
  paddingRight: spacing[3],
  margin: 0,
});

// TODO(cedric): remove this when we removed all `h4` tags in the MDX files
const headlineStyle = css({
  h4: {
    display: 'inline',
    margin: '0 !important',
    padding: '0 !important',
  },
});

const markerStyle = css({
  flexShrink: 0,
  marginRight: spacing[1.5],
  transform: 'rotate(-90deg)',
  transition: `transform 200ms`,

  'details[open] &': { transform: 'rotate(0)' },
});

const contentStyle = css({
  padding: `${spacing[2]}px ${spacing[4]}px 0`,

  p: {
    marginLeft: 0,
  },
});

// TODO(cedric): remove everything below this line once we switch to MDX v2,
// that won't support separate <details> and <summary> tags.
// To implement this collapsible with MDX v1, without changing the pages, we need to add them separately to markdown.

/** @deprecated please use `<Collapsible>` instead of `<DETAILS>` */
export const DETAILS = ({
  testID,
  children,
  ...rest
}: PropsWithChildren<Omit<CollapsibleProps, 'summary'>>) => {
  // Pull out the `<summary>` to style the content differently.
  const childrenList = React.Children.toArray(children);
  const summary = childrenList.find(node => nodeIsTag(node, 'summary'));
  if (summary) {
    childrenList.splice(childrenList.indexOf(summary), 1);
  }

  return (
    <details css={detailsStyle} data-testid={testID} {...rest}>
      {summary}
      <div css={contentStyle}>{childrenList}</div>
    </details>
  );
};

/** @deprecated please use `<Collapsible>` instead of `<SUMMARY>` */
export const SUMMARY = ({ testID, children }: PropsWithChildren<{ testID?: string }>) => (
  <summary css={summaryStyle} data-testid={testID}>
    <TriangleDownIcon css={markerStyle} size={iconSize.small} />
    <HEADLINE tag="span" css={headlineStyle}>
      {children}
    </HEADLINE>
  </summary>
);

function nodeIsTag(node: ReactNode, tag: string) {
  return typeof node === 'object' ? (node as any).props?.originalType === tag : false;
}
