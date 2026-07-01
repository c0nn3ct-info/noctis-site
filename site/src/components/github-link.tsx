import { Github } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';

const REPO_URL = 'https://github.com/c0nn3ct-info/noctis';

export function GithubLink() {
  return (
    <IconButton
      asChild
      variant="standard"
      size="s"
      aria-label="GitHub"
      title="GitHub"
    >
      <a href={REPO_URL} target="_blank" rel="noreferrer noopener">
        <Github />
      </a>
    </IconButton>
  );
}
