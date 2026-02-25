import { Component, inject, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { COMMENTS_IMPORTS } from './comments-imports';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommentItem } from '@shared/models/comments.model';

@Component({
  selector: 'app-comments',
  imports: [SHARED_IMPORTS, COMMENTS_IMPORTS],
  templateUrl: './comments.html',
  styleUrl: './comments.scss',
})
export class CommentsComponent {

  /** DI */
  private dynamicConfig = inject(DynamicDialogConfig);
  protected ref = inject(DynamicDialogRef);

  // 資料屬性
  datas = signal<CommentItem[]>([])
  isCommonRequired = signal<boolean>(false);

  ngOnInit() {
    const incomingData: any = this.dynamicConfig.data;
    
    // console.log('incomingData: ', incomingData);

    if (Array.isArray(incomingData)) {
      // 1. 多筆評價
      this.datas.set(incomingData);
    } else if (incomingData && typeof incomingData === 'object') {
      // 2. 檢查這是不是「單一個 CommentItem」物件 (單筆)
      if ('pId' in incomingData) {
        // 需要包成陣列 CommentItem[]
        this.datas.set([incomingData]); 
      } else {
        /**
         * 3. 只有當資料結構真的是 { 0: {}, 1: {} } 才用 Object.values，
         *    主要是 dynamicDialog.data 雖然傳入的是 []，但 dynamicDialog 
         *    底層邏輯會轉成 { 0: {}, 1: {} } 這樣的結構，所以需要在自行轉
         *    成陣列 CommentItem[]
         */
        const convertedArray = Object.values(incomingData) as CommentItem[];
        this.datas.set(convertedArray);
      }
    }
  }

  /** 送出所有評論: 要 comment都有填寫， rating 本來就默認為 0 */
  submitAllComments() {
    const results: CommentItem[] = this.datas();
    
    // 檢查是否所有評論都有填寫 
    const isAllFilled = results.every(d => d.myComment && d.myComment.trim() !== '');
    
    if (!isAllFilled) {
      this.isCommonRequired.set(true);
      return;
    }

    // 將整組資料丟回給原頁面
    this.ref.close(results);
  }

}
