import prisma from "../../helpers/prisma";

export const totalCounts = async (req, res) => {
    try {
        
        const users = await prisma.user.count()
      
        res.json({
          success: true,
        count:{
            users:users
        }
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
        res.status(500).json({
          success: false,
          error: "Failed to fetch counts"
        });
      }
  }