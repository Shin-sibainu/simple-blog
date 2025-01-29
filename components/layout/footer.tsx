import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between py-10 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Classic Blog. All rights reserved.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Built with{" "}
              <Link
                href="https://notepress.xyz"
                className="hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Notepress
              </Link>
            </p>
          </div>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <Link
              href={profile.social.twitter}
              className="text-muted-foreground hover:text-primary"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href={profile.social.github}
              className="text-muted-foreground hover:text-primary"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href={profile.social.linkedin}
              className="text-muted-foreground hover:text-primary"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
