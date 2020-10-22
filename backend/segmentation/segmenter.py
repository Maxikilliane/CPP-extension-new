import os
import pandas as pd
import numpy as np
import word2vec
import classifiers.data_processing as dp
import urllib3
import re
import string
from classifiers.data_processing import get_weight_matrix, get_tokens
from sklearn.feature_extraction.text import CountVectorizer
from segmentation.tools import get_penalty, get_segments
from segmentation.algorithms import split_optimal, split_greedy, get_total
from segmentation.tools import SimpleSentenceTokenizer
from bs4 import BeautifulSoup
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager




def removeUnneccessaryElements(soup):
    for script in soup(["script", "style", "nav", "footer", "header", "img", "option", "select", "head", "button"]):
        script.extract()    # rip it out
    for div in soup.find_all("div", {'class':'footer'}):
        print("PROBLEM: FOOTER")
        div.decompose()
    # for div in soup.find_all("div", {'class': re.compile(r"sidebar")}):
    #     div.decompose()
    for div in soup.find_all("div", {'data-testid': re.compile(r"ax-navigation-menubar")}):
        div.decompose()
    for div in soup.find_all("div", {'class': re.compile(r"menu")}):
        print("PROBLEM: MENU")
        div.decompose()
    for li in soup.find_all("li", {'class': re.compile(r"menu")}):
        print("PROBLEM: MENU LI")
        li.decompose()
    for p in soup.find_all("p", {'class': re.compile(r"heading")}):
        print("PROBLEM: HEADING P")
        p.decompose()
    for p in soup.find_all("p", {'class': re.compile(r"fw-bold")}):
        print("PROBLEM: P BOLD")
        p.decompose()
    for ul in soup.find_all("ul", {'class': re.compile(r"menu")}):
        ul.decompose()
    # for div in soup.find_all("div", {'class': re.compile(r"header")}):
    #     print("PROBLEM: HEADER")
        # div.decompose()
    for div in soup.find_all("div", {'data-referrer': re.compile(r"page_footer")}):
        div.decompose()
    for div in soup.find_all("div", {'id':'footer'}):
        print("PROBLEM: FOOTER DIV")
        div.decompose()
    for div in soup.find_all("div", {'id': re.compile(r"sidebar")}):
        print("PROBLEM: SIDEBAR")
        div.decompose()
    for div in soup.find_all("div", {'id': re.compile(r"menu")}):
        print("PROBLEM: MENU")
        div.decompose()
    for li in soup.find_all("li", {'id': re.compile(r"menu")}):
        li.decompose()
    for ul in soup.find_all("ul", {'id': re.compile(r"menu")}):
        ul.decompose()
    for div in soup.find_all("div", {'id': re.compile(r"header")}):
        div.decompose()
    for div in soup.find_all("div", {'id': re.compile(r"breadcrumbs")}):
        div.decompose()
    for div in soup.find_all("div", {'id': re.compile(r"instagram")}):
        div.decompose()
    for div in soup.find_all("div", {'role': re.compile(r"navigation")}):
        div.decompose()
    for div in soup.find_all("div", {'role': re.compile(r"banner")}):
        div.decompose()
    for div in soup.find_all("div", {'role': re.compile(r"button")}):
        div.decompose()
    for div in soup.find_all("ul", {'role': re.compile(r"navigation")}):
        div.decompose()


def makeCoarseSegments(soup):
    segments = []
    for p in soup.find_all("p"):
        if p.find_next() is not None:
            if p.find_next().name != "ul":
                segments.append(' '.join(p.get_text().split()))
    listSplitter = []
    for ul in soup.find_all("ul"):
        if ul.find_previous('p') is not None:
            parent = ' '.join(ul.find_previous('p').text.split())
            for element in ul.findChildren('li'):
                text = ' '.join(element.get_text().split())
                listElement = f"{parent} {text}"
                segments.append(listElement)
    if not segments:
        text = soup.getText().replace('\n', '').replace('↵', '')
        result = useAlgorithm(text)
    else:
        # text = " ".join(segments)
        # print("TEXT??", text)
        print("SEGMENTS??", segments)
        result = segments
    return result

def segmentatePP(url):
    print("WIR SIND IM SEGMENTER :)", url)
    length = 0
    if url.find("aliexpress") != -1:
        url = "https://helppage.aliexpress.com/buyercenter/questionAnswer.htm?isRouter=0&viewKey=1&id=1000099018&categoryIds=9205401"
    if url.find("gstatic") != -1:
        import requests
        import io
        import pdfplumber
        print("PDF DETECTED")
        r = requests.get(url, verify=True)
        document = io.BytesIO(r.content)
        wholeDocument = ""
        with pdfplumber.load(document) as pdf:
            print("pages")
            print(pdf.pages)
            for page in pdf.pages:
                wholeDocument += page.extract_text()
        print("THE WHOLE DOCUMENT")
        # length = sum([i.strip(string.punctuation).isalpha() for i in wholeDocument.split()])
        length = len(re.findall(r'\w+', wholeDocument))
        print("LÄNGE!", length)
        segments = useAlgorithm(wholeDocument)
        print(segments)
    else:
        if url.find("amazon") != -1:
            url = "https://www.amazon.com/gp/help/customer/display.html?ie=UTF8&nodeId=468496&ref_=footer_privacy"
        elif url.find("nytimes") != -1:
            url = "https://www.nytimes.com/subscription/privacy-policy#/privacy"
        options = webdriver.ChromeOptions()
        options.add_argument('headless')
        options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36")

        # start chrome browser
        browser = webdriver.Chrome(ChromeDriverManager().install(),  chrome_options=options)

        browser.get(url)
        html = browser.page_source
        soup = BeautifulSoup(html)
        print("Das ist das doc: ", soup.get_text())
        browser.quit()
        removeUnneccessaryElements(soup)
        print("wenn removed", soup)
        length = len(re.findall(r'\w+', soup.get_text()))
        print("LÄNGE!", length)

         #body = soup.find('body')
        # html = body.findChildren(recursive=False)
        segments = makeCoarseSegments(soup)
                #print("HALLO I BIMS EIN AMAOZN")

    segments = list(filter(None, segments))            #soup.find('div', class="help-content")
    segments.append(length)
    return segments


def useAlgorithm(text):
    lines = (line.strip() for line in text.splitlines())

    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))

    text = '\n'.join(chunk for chunk in chunks if chunk)


    fast_text_model = 'classifiers/data/fastText-0.1.0/corpus_vectors_default_300d'
    word2vector_fast_text = dp.get_fast_text_dicts(fast_text_model, "segmentation/embeddings_data", 100, missing = False, read = True)
    keys = list(word2vector_fast_text.keys())
    values = list(word2vector_fast_text.values())
    wrdvecs = pd.DataFrame(values, index=keys)



    sentence_tokenizer = SimpleSentenceTokenizer()

    segment_len = 1  # segment target length in sentences
    # book_path = 'index.html'
    sentenced_text = sentence_tokenizer(text)
    print("SENTECED TEXT!!", sentenced_text)
    vecr = CountVectorizer(vocabulary=wrdvecs.index)

    sentence_vectors = vecr.transform(sentenced_text).dot(wrdvecs)

    penalty = get_penalty([sentence_vectors], segment_len)
    print('penalty %4.2f' % penalty)

    optimal_segmentation = split_optimal(sentence_vectors, penalty, seg_limit=250)
    segmented_text = get_segments(sentenced_text, optimal_segmentation)
    print("segmented text!", segmented_text)
    # print('%d sentences, %d segments, avg %4.2f sentences per segment' % (
    #     len(sentenced_text), len(segmented_text), len(sentenced_text) / len(segmented_text)))
    # #
    # with open(book_path + '.seg', 'wt') as f:
    #     for i, segment_sentences in enumerate(segmented_text):
    #         segment_str = ' // '.join(segment_sentences)
    #         gain = optimal_segmentation.gains[i] if i < len(segmented_text) - 1 else 0
    #         segment_info = ' [%d sentences, %4.3f] ' % (len(segment_sentences), gain)
    #         print(segment_str + '\n8<' + '=' * 30 + segment_info + "=" * 30, file=f)

    # greedy_segmentation = split_greedy(sentence_vectors, max_splits=len(optimal_segmentation.splits))
    # greedy_segmented_text = get_segments(sentenced_text, greedy_segmentation)

    return segmented_text
