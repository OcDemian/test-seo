import {FC, useEffect, useState} from "react";
import { v4 as uuidv4 } from 'uuid';

type Props = {}

type News = {
    id:string;
    title: string;
    text?: string;
}

const News:FC <Props> = () => {
    const [news, setNews] = useState<News[]>(() => {
        const savedTasks = window.localStorage.getItem('news');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });

    const [newsNameAdd, setNewsNameAdd] = useState<string>('');
    const [newsTextAdd, setNewsTextAdd] = useState<string>('');
    const [editId, setEditId] = useState<string>('');
    const [editTitle, setEditTitle] = useState<string>('');
    const [editText, setEditText] = useState<string>('');

    const addNews = () => {
        if (newsNameAdd.trim() === "") return;
        setNews([...news, {id: uuidv4(), title: newsNameAdd, text: newsTextAdd}])
        setNewsNameAdd('');
        setNewsTextAdd('');
    }

    const startEdit = (elem:News) => {
        setEditId(elem.id);
        setEditTitle(elem.title);
        setEditText(elem.text ?? '');
    }

    const saveEdit = () => {
          const seveNews = news.map((el) => {
              if (el.id === editId){
                  return {id: el.id, title: editTitle, text: editText}
              }else{
                  return el
              }
          })
        setNews(seveNews);
        setEditId('');
        setEditTitle('');
        setEditText('');
    }

    const stopEdit = () => {
        setEditId('');
        setEditTitle('');
        setEditText('');
    }

    const deleteNews = (id:string) => {
        const newList = news.filter(el => el.id !== id);
        setNews(newList);
    }

    useEffect(() => {
        window.localStorage.setItem('news', JSON.stringify(news));
    }, [news]);

    return (
        <div>
            <h1>Новости</h1>
            <div className={'addNews'}>
                <input className={'input'} type='text' placeholder={'Название'} value={newsNameAdd} onChange={(e) => setNewsNameAdd(e.target.value)}/>
                <input className={'input'} type='text' placeholder={'Описание'} value={newsTextAdd} onChange={(e) => setNewsTextAdd(e.target.value)}/>
                <button onClick={() => addNews()}>Добавить</button>
            </div>
            <div className={'newsList'}>
                {news.map((elem) => (
                    <div key={elem.id} className={'newsItem'}>
                        {editId === elem.id ? (
                            <>
                                <div className={'newsItemContent'}>
                                    <input className={'input'} type='text' placeholder={'Название'} required
                                           value={editTitle} onChange={(e) => setEditTitle(e.target.value)}/>
                                    <textarea className={'textarea'} value={editText} placeholder={'Описание'}
                                              onChange={(e) => setEditText(e.target.value)}></textarea>
                                    {/*<input className={'input'} type='text' placeholder={'Описание'} value={editText}*/}
                                    {/*       onChange={(e) => setEditText(e.target.value)}/>*/}
                                </div>
                                <div className={'control'}>
                                    <button onClick={() => saveEdit()}>Сохранить</button>
                                    <button onClick={() => stopEdit()}>Отменить</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={'newsItemContent'}>
                                    <div className={'newsItemTitle'}>{elem.title}</div>
                                    <div className={'newsItemText'}>{elem.text}</div>
                                </div>
                                <div className={'control'}>
                                    <button onClick={() => startEdit(elem)}>Изменить</button>
                                    <button onClick={() => deleteNews(elem.id)}>Удалить</button>
                                </div>
                        </>
                        )}


                    </div>
                    )
                )}
            </div>

        </div>
    )
}

export default News;