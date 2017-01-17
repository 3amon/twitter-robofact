import json, requests, html2text, re, nltk.data, time

sent_detector = nltk.data.load('tokenizers/punkt/english.pickle')

def MakeTweet(text):
	sents = sent_detector.tokenize(text.strip().replace('\n', ' '))
	result = ''
	for sent in sents:
		newres = result + sent
		if len(newres) > 140:
			return result
		result = newres

		return result

def FilterTweet(text):
	if 'may refer to' in text.lower():
		return ''

	if '##' in text:
		return ''

	if not text.endswith('.'):
		return ''

	if text.endswith('a.k.a.'):
		return ''

	if text.lower().startswith('this is a list'):
		return ''

	if len(text) < 75:
		return ''

	return text

with open('wik-scrape.txt', 'w') as fhandle:

	while(True):

		#'https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exchars=500&format=json'
		get_random_pages_query = 'https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exchars=500&format=json'
		r = requests.get(get_random_pages_query)

		j = r.json()

		pages = j["query"]["pages"]

		for page in pages:
			extract = pages[page]["extract"]
			text = html2text.html2text(extract)
			try:
				res = FilterTweet(MakeTweet(text))
				if len(res) > 0:
					fhandle.write(res)
					fhandle.write('\n')
					print res
					print ''
			except UnicodeEncodeError:
				pass
		time.sleep(0)