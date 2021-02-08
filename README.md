# TuneGenie

- Static website, just clone and open index_full.html

# Deploy

## One time install __awscli__

	mkvirtualenv aws
	pip install awscli

Make sure you install your public key on bitbucket.org so the __git archive__ command will work for you.

## Deploy to site

	workon aws
	bash deploy.sh
