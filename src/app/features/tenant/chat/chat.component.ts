import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ChatMessage } from '../../../core/models';

@Component({
  selector: 'app-tenant-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class TenantChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesList') private messagesList!: ElementRef;

  inquiryId: string | null = null;
  messages: ChatMessage[] = [];
  newMessage = '';
  loading = true;
  sending = false;
  currentUserId: string = '';
  private pollInterval: any;
  private shouldScroll = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.inquiryId   = this.route.snapshot.queryParamMap.get('inquiryId');
    this.currentUserId = this.auth.currentUser?.userId || '';

    if (this.inquiryId) {
      this.loadMessages();
      this.pollInterval = setInterval(() => this.loadMessages(true), 3000);
    } else {
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  loadMessages(silent = false): void {
    if (!this.inquiryId) return;
    if (!silent) this.loading = true;

    this.api.getChatMessages(this.inquiryId).subscribe({
      next: msgs => {
        const prevLen = this.messages.length;
        this.messages = msgs;
        this.loading  = false;
        if (msgs.length !== prevLen) this.shouldScroll = true;
      },
      error: () => this.loading = false
    });
  }

  send(): void {
    if (!this.newMessage.trim() || !this.inquiryId || this.sending) return;

    const content = this.newMessage.trim();
    this.newMessage = '';
    this.sending    = true;

    this.api.sendChatMessage(this.inquiryId, content).subscribe({
      next: msg => {
        this.messages.push(msg);
        this.sending      = false;
        this.shouldScroll = true;
      },
      error: () => { this.sending = false; this.newMessage = content; }
    });
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send(); }
  }

  isMine(msg: ChatMessage): boolean {
    return msg.senderId === this.currentUserId;
  }

  private scrollToBottom(): void {
    try { this.messagesList.nativeElement.scrollTop = this.messagesList.nativeElement.scrollHeight; }
    catch {}
  }
}
