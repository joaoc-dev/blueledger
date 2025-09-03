import { Github, HandCoins } from 'lucide-react';
import { Button } from '@/components/ui/button';

const REPO_URL = 'https://github.com/joaoc-dev/blueledger';
const TREE_URL = `${REPO_URL}/tree/main`;
const ISSUES_URL = `${REPO_URL}/issues`;
const CHANGELOG_URL = `${REPO_URL}/blob/main/CHANGELOG.md`;
const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`;

export function Footer() {
  return (
    <div className="px-4 py-6 2xl:px-12 2xl:py-12">
      <div className="flex flex-col gap-10 md:flex-row md:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-foreground">
            <HandCoins className="w-4 h-4" />
            <span className="font-semibold">BlueLedger</span>
          </div>
          <div className="mb-8">
            <p className="text-sm text-muted-foreground">
              Secure, fast, and seamless expense sharing.
            </p>
            <p className="text-sm text-muted-foreground">
              An open‑source showcase with a modern stack and thoughtful UX.
            </p>
          </div>
          <div>
            <Button asChild variant="default">
              <a href={REPO_URL} target="_blank" rel="noreferrer noopener">
                <Github className="w-4 h-4" />
                Star on GitHub
              </a>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-12 text-sm">
          <div>
            <div className="text-foreground font-medium mb-3">Quick Menu</div>
            <ul className="space-y-2">
              <li><a href="#features" className="landing__text-link">Features</a></li>
              <li><a href="#pricing" className="landing__text-link">Pricing</a></li>
              <li><a href="#testimonials" className="landing__text-link">Testimonials</a></li>
              <li><a href="#faq" className="landing__text-link">FAQ</a></li>
            </ul>
          </div>
          <div>
            <div className="text-foreground font-medium mb-3">Project</div>
            <ul className="space-y-2">
              <li>
                <a href={TREE_URL} target="_blank" rel="noreferrer noopener" className="landing__text-link">GitHub</a>
              </li>
              <li>
                <a href={ISSUES_URL} target="_blank" rel="noreferrer noopener" className="landing__text-link">Report an issue</a>
              </li>
              <li>
                <a href={CHANGELOG_URL} target="_blank" rel="noreferrer noopener" className="landing__text-link">Changelog</a>
              </li>
              <li>
                <a href={LICENSE_URL} target="_blank" rel="noreferrer noopener" className="landing__text-link">License (MIT)</a>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-foreground font-medium mb-3">Attributions</div>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                {' '}
                <a
                  className="landing__text-link"
                  href="https://storyset.com/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Illustrations - Storyset
                </a>
              </li>
              <li>
                {' '}
                <a
                  className="landing__text-link"
                  href="https://www.pexels.com"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Avatars - Pexels
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
