import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const IContactYou = () => {
  return (
    <Dialog>
      <DialogTrigger className="box-border bg-gradient-to-t from-[#EB5D30] to-[#F47E58] border-2 border-[#EB5D30] shadow-sm rounded-[10px] px-4 py-2 text-white font-bold">
        I contact you
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          
          <DialogTitle>Reaching out is always scary</DialogTitle>
          <p>
            ...so let me reach out to you instead. I&apos;ll send you an email to
          </p>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default IContactYou
