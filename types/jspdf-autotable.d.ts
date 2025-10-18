declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf'

  interface AutoTableOptions {
    head?: any[][]
    body?: any[][]
    foot?: any[][]
    startY?: number
    margin?: { top?: number; right?: number; bottom?: number; left?: number }
    theme?: 'striped' | 'grid' | 'plain'
    headStyles?: {
      fillColor?: number[]
      textColor?: number[]
      fontStyle?: string
      fontSize?: number
    }
    bodyStyles?: {
      fillColor?: number[]
      textColor?: number[]
      fontSize?: number
    }
    alternateRowStyles?: {
      fillColor?: number[]
    }
    columnStyles?: { [key: string]: any }
  }

  export default function autoTable(options: AutoTableOptions): void

  module 'jspdf' {
    interface jsPDF {
      autoTable: (options: AutoTableOptions) => jsPDF
      lastAutoTable?: {
        finalY: number
      }
    }
  }
}

