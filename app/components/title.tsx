import React from 'react';
import './title.css'; // CSSファイルをインポート

type TitleProps = {
    titleName: string;
}

export const Title = ({ titleName }: TitleProps) => {
    return (
        <h2 className="title">{titleName}</h2>
    );
};
