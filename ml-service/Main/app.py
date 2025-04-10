from flask_cors import CORS
from flask import Flask, request, render_template, jsonify
import pandas as pd
import neattext.functions as nfx
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from dashboard import getvaluecounts, getlevelcount, getsubjectsperlevel, yearwiseprofit

app = Flask(__name__)
# CORS(app, origins=["http://localhost:3000"])
CORS(app)

def readdata():
    return pd.read_csv('UdemyCleanedTitle.csv')

def getcleantitle(df):
    df['Clean_title'] = df['course_title'].apply(nfx.remove_stopwords)
    df['Clean_title'] = df['Clean_title'].apply(nfx.remove_special_characters)
    return df

def getcosinemat(df):
    countvect = CountVectorizer()
    return countvect.fit_transform(df['Clean_title'])

def cosinesimmat(cv_mat):
    return cosine_similarity(cv_mat)

def recommend_course(df, title, cosine_mat, numrec):
    course_index = pd.Series(df.index, index=df['course_title']).drop_duplicates()
    index = course_index[title]
    scores = list(enumerate(cosine_mat[index]))
    sorted_scores = sorted(scores, key=lambda x: x[1], reverse=True)
    selected_course_index = [i[0] for i in sorted_scores[1:numrec+1]]
    selected_course_score = [i[1] for i in sorted_scores[1:numrec+1]]
    rec_df = df.iloc[selected_course_index]
    rec_df['Similarity_Score'] = selected_course_score
    return rec_df[['course_title', 'Similarity_Score', 'url', 'price', 'num_subscribers']]

def searchterm(term, df):
    result_df = df[df['course_title'].str.contains(term, case=False, na=False)]
    return result_df.sort_values(by='num_subscribers', ascending=False).head(6)

def extractfeatures(recdf):
    course_url = list(recdf['url'])
    course_title = list(recdf['course_title'])
    course_price = list(recdf['price'])
    return course_url, course_title, course_price

# JSON API for React frontend
@app.route('/api/recommend', methods=['POST'])

def api_recommend():
    data = request.get_json()
    titlename = data.get('course', '')

    try:
        df = readdata()
        df = getcleantitle(df)
        cvmat = getcosinemat(df)
        cosine_mat = cosinesimmat(cvmat)
        recdf = recommend_course(df, titlename, cosine_mat, 6)
        course_url, course_title, course_price = extractfeatures(recdf)
        dictmap = dict(zip(course_title, course_url))
        return jsonify({
            "coursemap": dictmap,
            "coursename": titlename,
            "showtitle": True,
            "error": False
        })

    except Exception as e:
        print("Exact title match failed. Searching by keyword...")
        try:
            df = readdata()
            resultdf = searchterm(titlename, df)
            course_url, course_title, course_price = extractfeatures(resultdf)
            coursemap = dict(zip(course_title, course_url))
            return jsonify({
                "coursemap": coursemap,
                "coursename": titlename,
                "showtitle": True,
                "error": False
            })
        except Exception as err:
            print("Search fallback failed:", err)
            return jsonify({
                "coursemap": {},
                "coursename": titlename,
                "showtitle": False,
                "error": True
            })

# Legacy HTML-based UI
@app.route('/', methods=['GET', 'POST'])
def hello_world():
    if request.method == 'POST':
        my_dict = request.form
        titlename = my_dict['course']
        try:
            df = readdata()
            df = getcleantitle(df)
            cvmat = getcosinemat(df)
            cosine_mat = cosinesimmat(cvmat)
            recdf = recommend_course(df, titlename, cosine_mat, 6)
            course_url, course_title, course_price = extractfeatures(recdf)
            dictmap = dict(zip(course_title, course_url))
            if len(dictmap) != 0:
                return render_template('index.html', coursemap=dictmap, coursename=titlename, showtitle=True)
            else:
                return render_template('index.html', showerror=True, coursename=titlename)
        except:
            resultdf = searchterm(titlename, df)
            if resultdf.shape[0] > 6:
                resultdf = resultdf.head(6)
            course_url, course_title, course_price = extractfeatures(resultdf)
            coursemap = dict(zip(course_title, course_url))
            if len(coursemap) != 0:
                return render_template('index.html', coursemap=coursemap, coursename=titlename, showtitle=True)
            else:
                return render_template('index.html', showerror=True, coursename=titlename)
    return render_template('index.html')

@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    df = readdata()
    valuecounts = getvaluecounts(df)
    levelcounts = getlevelcount(df)
    subjectsperlevel = getsubjectsperlevel(df)
    yearwiseprofitmap, subscriberscountmap, profitmonthwise, monthwisesub = yearwiseprofit(df)

    return render_template('dashboard.html',
                           valuecounts=valuecounts,
                           levelcounts=levelcounts,
                           subjectsperlevel=subjectsperlevel,
                           yearwiseprofitmap=yearwiseprofitmap,
                           subscriberscountmap=subscriberscountmap,
                           profitmonthwise=profitmonthwise,
                           monthwisesub=monthwisesub)

if __name__ == '__main__':
    app.run(debug=True)
