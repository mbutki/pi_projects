set mouse-=a
set nocompatible
set nobackup
set nowritebackup
set noswapfile
set shiftwidth=4
set softtabstop=4
set expandtab
set ruler
set ignorecase
syntax on
set ruler
set tabstop=4
set viminfo='1000,<1000,s1000,h

"syntax match Tab /\t/
"hi Tab gui=underline guifg=blue ctermbg=blue
set list!
set listchars=tab:>-

map <C-A> <Home>
map <C-E> <End>
imap <C-A> <Home>
imap <C-E> <End>
vmap <C-A> <Home>
vmap <C-E> <End>
nmap <C-A> <Home>
nmap <C-E> <End>
cmap <C-A> <Home>
cmap <C-E> <End>

function! ResCur()
  if line("'\"") <= line("$")
    normal! g`"
    return 1
  endif
endfunction

augroup resCur
  autocmd!
  autocmd BufWinEnter * call ResCur()
augroup END
